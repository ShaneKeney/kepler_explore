import parse from 'csv-parse'
import fs from 'fs'

enum StatusType {
  Confirmed = "CONFIRMED",
  Candidate = "CANDIDATE",
  FPositive = "FALSE POSITIVE",
}

interface KeplerData {
  kepid: Number,
  kepoi_name: String,
  kepler_name: String,
  koi_disposition: StatusType,
  koi_pdisposition: StatusType,
  koi_score: Number,
  koi_fpflag_nt: Number,
  koi_fpflag_ss: Number,
  koi_fpflag_co: Number,
  koi_fpflag_ec: Number,
  koi_period: Number,
  koi_period_err1: Number,
  koi_period_err2: Number,
  koi_time0bk: Number,
  koi_time0bk_err1: Number,
  koi_time0bk_err2: Number,
  koi_impact: Number,
  koi_impact_err1: Number,
  koi_impact_err2: Number,
  koi_duration: Number,
  koi_duration_err1: Number,
  koi_duration_err2: Number,
  koi_depth: Number,
  koi_depth_err1: Number,
  koi_depth_err2: Number,
  koi_prad: Number,
  koi_prad_err1: Number,
  koi_prad_err2: Number,
  koi_teq: Number,
  koi_teq_err1: Number,
  koi_teq_err2: Number,
  koi_insol: Number,
  koi_insol_err1: Number,
  koi_insol_err2: Number,
  koi_model_snr: Number,
  koi_tce_plnt_num: Number,
  koi_tce_delivname: Number,
  koi_steff: Number,
  koi_steff_err1: Number,
  koi_steff_err2: Number,
  koi_slogg: Number,
  koi_slogg_err1: Number,
  koi_slogg_err2: Number,
  koi_srad: Number,
  koi_srad_err1: Number,
  koi_srad_err2: Number,
  ra: Number,
  dec: Number,
  koi_kepmag: Number,
}

const habitablePlanets: Array<KeplerData> = []

function isHabitable(planet: KeplerData): Boolean {
  return planet['koi_disposition'] === StatusType.Confirmed
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6
}

fs.createReadStream('kepler_data.csv')
  .pipe(parse({
    comment: '#',
    columns: true
  }))
  .on('data', (data) => {
    if (isHabitable(data)) habitablePlanets.push(data)
  })
  .on('error', (err) => {
    console.log(err)
  })
  .on('end', () => {
    console.log(habitablePlanets.map((planet) => {
      return planet['kepler_name']
    }))
    console.log(`${habitablePlanets.length} habitable planets found!`)
  })