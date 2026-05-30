import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import { countries, countryMap } from "../data/countries";
import { getDefaultEntry } from "../data/visaData";
import { getVisaDetail, getCountryTouristInfo } from "../data/countryDetails";
import { officialLinks } from "../data/officialLinks";
import { cache, TTL } from "../lib/cache";

const router: IRouter = Router();

// Static data — cache forever (data never changes at runtime)
const STATIC = TTL.FOREVER;
const CACHE_CONTROL_STATIC = "public, max-age=86400, stale-while-revalidate=604800";
const CACHE_CONTROL_SHORT  = "public, max-age=300, stale-while-revalidate=3600";

const popularDestinationCodes = [
  "FR", "ES", "IT", "US", "GB", "JP", "TH", "AU",
  "DE", "TR", "MX", "IN", "GR", "ID", "BR", "AE",
  "SG", "CA", "MA", "PT",
];

// Pre-compute the global power rankings once at startup — O(n²) done once, never again
function buildPowerRankings(): Map<string, number> {
  return cache.getOrSet("power_rankings", () => {
    const scores = new Map<string, number>();
    for (const passport of countries) {
      let score = 0;
      for (const dest of countries) {
        if (dest.code === passport.code) continue;
        const e = getDefaultEntry(passport.code, dest.code);
        if (
          e.requirement === "visa_free" ||
          e.requirement === "visa_on_arrival" ||
          e.requirement === "e_visa"
        ) score++;
      }
      scores.set(passport.code, score);
    }
    return scores;
  }, STATIC);
}

// Sorted rankings list (for rank lookup)
function getSortedRankings(): [string, number][] {
  return cache.getOrSet("sorted_rankings", () => {
    const scores = buildPowerRankings();
    return [...scores.entries()].sort((a, b) => b[1] - a[1]);
  }, STATIC);
}

// All passport rankings in one shot — used by the Tier List page
router.get("/visa/all-rankings", (_req: Request, res: Response): void => {
  const sorted = getSortedRankings();
  // Map to [{code, score}] — client enriches with name/flag from /api/countries
  const rankings = sorted.map(([code, score]) => ({ code, score }));
  res.setHeader("Cache-Control", CACHE_CONTROL_STATIC);
  res.json({ rankings });
});

router.get("/visa/check", async (req: Request, res: Response): Promise<void> => {
  const querySchema = z.object({
    passport: z.string().min(2).max(2).toUpperCase(),
    destination: z.string().min(2).max(2).toUpperCase(),
  });

  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid passport or destination code. Use ISO 3166-1 alpha-2 codes." });
    return;
  }

  const { passport, destination } = parsed.data;
  const passportCountry = countryMap.get(passport);
  const destinationCountry = countryMap.get(destination);

  if (!passportCountry) { res.status(400).json({ error: `Unknown passport country code: ${passport}` }); return; }
  if (!destinationCountry) { res.status(400).json({ error: `Unknown destination country code: ${destination}` }); return; }

  const cacheKey = `visa_check:${passport}:${destination}`;
  const result = cache.getOrSet(cacheKey, () => {
    const entry = getDefaultEntry(passport, destination);
    return { passportCountry, destinationCountry, requirement: entry.requirement, maxStay: entry.maxStay ?? null, notes: entry.notes ?? null };
  }, STATIC);

  req.log.info({ passport, destination, requirement: result.requirement }, "Checked visa requirement");
  res.setHeader("Cache-Control", CACHE_CONTROL_STATIC);
  res.json(result);
});

router.post("/visa/check-multiple", async (req: Request, res: Response): Promise<void> => {
  const bodySchema = z.object({
    passport: z.string().min(2).max(2).toUpperCase(),
    destinations: z.array(z.string().min(2).max(2).toUpperCase()).min(1).max(50),
  });

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body. Provide passport code and array of destination codes." });
    return;
  }

  const { passport, destinations } = parsed.data;
  const passportCountry = countryMap.get(passport);
  if (!passportCountry) { res.status(400).json({ error: `Unknown passport country code: ${passport}` }); return; }

  const results = destinations
    .map((dest) => {
      const destinationCountry = countryMap.get(dest);
      if (!destinationCountry) return null;
      const entry = getDefaultEntry(passport, dest);
      return { passportCountry, destinationCountry, requirement: entry.requirement, maxStay: entry.maxStay ?? null, notes: entry.notes ?? null };
    })
    .filter(Boolean);

  req.log.info({ passport, count: results.length }, "Checked multiple visa requirements");
  // POST — no caching (destinations vary), but still compressible
  res.setHeader("Cache-Control", "no-store");
  res.json(results);
});

router.get("/visa/check-all", async (req: Request, res: Response): Promise<void> => {
  const querySchema = z.object({
    passport: z.string().min(2).max(2).toUpperCase(),
  });

  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) { res.status(400).json({ error: "Invalid passport code." }); return; }

  const { passport } = parsed.data;
  const passportCountry = countryMap.get(passport);
  if (!passportCountry) { res.status(400).json({ error: `Unknown passport country code: ${passport}` }); return; }

  const results = cache.getOrSet(`check_all:${passport}`, () =>
    countries
      .filter((c) => c.code !== passport)
      .map((dest) => {
        const entry = getDefaultEntry(passport, dest.code);
        return { passportCountry, destinationCountry: dest, requirement: entry.requirement, maxStay: entry.maxStay ?? null, notes: entry.notes ?? null };
      }),
    STATIC,
  );

  req.log.info({ passport, count: results.length }, "Checked visa for all countries");
  res.setHeader("Cache-Control", CACHE_CONTROL_STATIC);
  res.json(results);
});

router.get("/visa/destination-info", async (req: Request, res: Response): Promise<void> => {
  const querySchema = z.object({
    passport: z.string().min(2).max(2).toUpperCase(),
    destination: z.string().min(2).max(2).toUpperCase(),
  });

  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) { res.status(400).json({ error: "Invalid passport or destination code." }); return; }

  const { passport, destination } = parsed.data;
  const passportCountry = countryMap.get(passport);
  const destinationCountry = countryMap.get(destination);

  if (!passportCountry) { res.status(400).json({ error: `Unknown passport country code: ${passport}` }); return; }
  if (!destinationCountry) { res.status(400).json({ error: `Unknown destination country code: ${destination}` }); return; }

  const result = cache.getOrSet(`destination_info:${passport}:${destination}`, () => {
    const entry = getDefaultEntry(passport, destination);
    const visaDetail = getVisaDetail(passport, destination, entry.requirement);
    const touristInfo = getCountryTouristInfo(destination);
    return {
      passportCountry, destinationCountry,
      requirement: entry.requirement,
      maxStay: entry.maxStay ?? null,
      notes: entry.notes ?? null,
      visaDetail,
      touristInfo: touristInfo ?? null,
      officialLinks: officialLinks[destination] ?? null,
    };
  }, STATIC);

  req.log.info({ passport, destination, requirement: result.requirement }, "Fetched destination info");
  res.setHeader("Cache-Control", CACHE_CONTROL_STATIC);
  res.json(result);
});

router.get("/visa/popular-destinations", async (_req: Request, res: Response): Promise<void> => {
  const popular = cache.getOrSet("popular_destinations", () =>
    popularDestinationCodes.map((code) => countryMap.get(code)).filter(Boolean),
    STATIC,
  );
  res.setHeader("Cache-Control", CACHE_CONTROL_STATIC);
  res.json(popular);
});

router.get("/visa/stats", async (req: Request, res: Response): Promise<void> => {
  const querySchema = z.object({
    passport: z.string().min(2).max(2).toUpperCase(),
  });

  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) { res.status(400).json({ error: "Invalid passport code." }); return; }

  const { passport } = parsed.data;
  const passportCountry = countryMap.get(passport);
  if (!passportCountry) { res.status(400).json({ error: `Unknown passport country code: ${passport}` }); return; }

  // O(n²) work — cached on first call, free on all subsequent calls
  const result = cache.getOrSet(`stats:${passport}`, () => {
    const counts = { visa_free: 0, visa_on_arrival: 0, e_visa: 0, visa_required: 0, no_admission: 0 };
    for (const country of countries) {
      if (country.code === passport) continue;
      const entry = getDefaultEntry(passport, country.code);
      counts[entry.requirement]++;
    }
    const total = countries.length - 1;
    const sorted = getSortedRankings();
    const rank = sorted.findIndex(([code]) => code === passport) + 1;

    return {
      passportCountry,
      visaFree: counts.visa_free,
      visaOnArrival: counts.visa_on_arrival,
      eVisa: counts.e_visa,
      visaRequired: counts.visa_required,
      noAdmission: counts.no_admission,
      total,
      powerRank: rank || sorted.length,
    };
  }, STATIC);

  req.log.info({ passport }, "Fetched visa stats");
  res.setHeader("Cache-Control", CACHE_CONTROL_STATIC);
  res.json(result);
});

// Health-check style cache-status endpoint (useful for monitoring)
router.get("/visa/cache-status", (_req: Request, res: Response): void => {
  res.setHeader("Cache-Control", CACHE_CONTROL_SHORT);
  res.json({ cacheSize: cache.size() });
});

// Warm up the most expensive computation at module load — 0 ms for all subsequent requests
buildPowerRankings();
getSortedRankings();

export default router;
