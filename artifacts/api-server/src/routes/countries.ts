import { Router, type IRouter } from "express";
import { countries } from "../data/countries";
import { getCountryTouristInfo } from "../data/countryDetails";
import { CACHE_STATIC } from "../lib/cacheControl";

const router: IRouter = Router();

// The 195-country list never changes at runtime and fifteen pages fetch it.
// Without a cache header this was a function invocation per page view.
router.get("/countries", (_req, res): void => {
  res.setHeader("Cache-Control", CACHE_STATIC);
  res.json(countries);
});

router.get("/countries/:code/tourist-info", (req, res): void => {
  const code = (req.params.code ?? "").toUpperCase();
  const info = getCountryTouristInfo(code);
  if (!info) {
    res.status(404).json({ error: `No tourist info found for country code: ${code}` });
    return;
  }
  res.setHeader("Cache-Control", CACHE_STATIC);
  res.json(info);
});

export default router;
