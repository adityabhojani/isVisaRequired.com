import { Router, type IRouter } from "express";
import { countries } from "../data/countries";
import { getCountryTouristInfo } from "../data/countryDetails";

const router: IRouter = Router();

router.get("/countries", async (req, res): Promise<void> => {
  req.log.info("Fetching all countries");
  res.json(countries);
});

router.get("/countries/:code/tourist-info", (req, res): void => {
  const code = (req.params.code ?? "").toUpperCase();
  const info = getCountryTouristInfo(code);
  if (!info) {
    res.status(404).json({ error: `No tourist info found for country code: ${code}` });
    return;
  }
  res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
  res.json(info);
});

export default router;
