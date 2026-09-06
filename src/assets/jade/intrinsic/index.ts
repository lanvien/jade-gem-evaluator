import chiMau1 from "./chi-mau-1.png.asset.json";
import chiMau2 from "./chi-mau-2.png.asset.json";
import chiMau3 from "./chi-mau-3.png.asset.json";
import ganNon1 from "./gan-non-1.png.asset.json";
import ganNon2 from "./gan-non-2.png.asset.json";
import ganNon3 from "./gan-non-3.png.asset.json";
import ganGia1 from "./gan-gia-1.png.asset.json";
import ganGia2 from "./gan-gia-2.png.asset.json";
import matCat1 from "./mat-cat-1.png.asset.json";
import soAm1 from "./so-am-1.png.asset.json";
import soAm2 from "./so-am-2.png.asset.json";
import soBong1 from "./so-bong-1.png.asset.json";
import soBong2 from "./so-bong-2.png.asset.json";
import soBong3 from "./so-bong-3.png.asset.json";
import soCheo1 from "./so-cheo-1.png.asset.json";
import soCheo2 from "./so-cheo-2.png.asset.json";
import soDoc1 from "./so-doc-1.png.asset.json";
import soDoc2 from "./so-doc-2.png.asset.json";
import soLuoiGa1 from "./so-luoi-ga-1.png.asset.json";
import soNgang1 from "./so-ngang-1.png.asset.json";
import soNgang2 from "./so-ngang-2.png.asset.json";
import hoaBay1 from "./hoa-bay-1.png.asset.json";
import hoaBay2 from "./hoa-bay-2.png.asset.json";
import hoaBay3 from "./hoa-bay-3.png.asset.json";
import hoaBay4 from "./hoa-bay-4.png.asset.json";
import vetNut1 from "./vet-nut-1.png.asset.json";
import vetNut2 from "./vet-nut-2.png.asset.json";

export const INTRINSIC_IMAGES = {
  hoa_bay: [hoaBay1.url, hoaBay2.url, hoaBay3.url, hoaBay4.url],
  chi_mau: [chiMau1.url, chiMau2.url, chiMau3.url],
  gan_non: [ganNon1.url, ganNon2.url, ganNon3.url],
  gan_gia: [ganGia1.url, ganGia2.url],
  so_bong: [soBong1.url, soBong2.url, soBong3.url],
  so_am: [soAm1.url, soAm2.url],
  so_luoi_ga: [soLuoiGa1.url],
  so_doc: [soDoc1.url, soDoc2.url],
  so_cheo: [soCheo1.url, soCheo2.url],
  so_ngang: [soNgang1.url, soNgang2.url],
  mat_cat: [matCat1.url],
  vet_nut: [vetNut1.url, vetNut2.url],
} as const;