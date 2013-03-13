/**
 * Example of a polyline decoding algorithm for decoding compressed lat/lng points
 *
 * @author Eric McConville <emcconville@tribune.com>
 * @param string polyLineString - ANSI encoded string
 * @return array - [lat-1,lng-1,lat-2,lng-2,...,lat-Nth,lng-Nth]
 */
function polylineDecode(polyLineString) 
{
	var lat_or_lng = charIndex = 0,
		points = [],
		previousPoint = [0,0];
	
	while(charIndex < polyLineString.length) {
		var shiftBlock = resultBit = 0x00;
		do {
			var bit = polyLineString.charCodeAt(charIndex++) - 0x3F; // Convet char to bit & offset
			resultBit |= (bit & 0x1F) << shiftBlock;                 // Alter resulting bit based on last block
			shiftBlock+=0x05;                                        // Advance to next 5-bit block
		} while (bit >= 0x20);
		var delta = resultBit & 0x01 ? ~(resultBit >> 0x01) : resultBit >> 0x01; // Determine number signing by last bit
		var number = previousPoint[lat_or_lng % 2] + delta;          // Calculate next number by addition of delta
		previousPoint[lat_or_lng % 2] = number;                      // Store new previous point
		lat_or_lng++;                                                // Move cursor to next lat/lng
	 	points.push((number * 1e-5).toFixed(5));                     // Append new number, and enforce precision rounding
	}
	return points;
}

// Simple Lat/Lng box
var tribune = "wxt~Fd`yuOCuErBC?vEoB@";
var tribunePoints = polylineDecode(tribune);
console.log(tribunePoints);

// Complex polygon body with extenstions, islands, and holes.
var chicago = [
	"cjl_Gjh_wOeIdAmJYaKzHyHTcAuNKaOIgNIgNKiNKoNnIe@|HBhJDhJBbIB`H@|HBxHBxIBhJBdHK_CqJImLtBoNzDuI}DqIA{NCiKt@kKoDqIsDwIeGsRaGgEoJbIuGlFuHfG}IjHkAmLAmL@sK?iKiNmEmEcInPgBlC}LrJoMrGmClH}CfKkGdEmIlDcKcFxHsRLuCkJA}KBsKnJLpILrIPjHhAhDqJjDsJnDqJ~CyIdEkI@qL?}K@uL@sL@uL@eN@eN?cN?eN?eNAyQ?iKAwMAqNA}KAkKAgKGoOEqKeHiBiJ@mL?qJCmIIqIGoJIeIYgJx@cSJmMJiAcNGiMGwMGyLKsNKuNIoNI{N@eM@sKDkKBwK@gLBwKBsKDkL}NnP}EuPAuMMgZpDqKnJiErIi@hHwA|GeCzHsBdHsCxGmE~EuF|JyIhFwFdFtGtHsAxHExHcCfHiAvGaDpHgBjHx@fHa@fHaAnH`@bHn@hGcDvHaHzFwH~J[bH?pH[fHyCfEgHrCqJtIa@nJ?jHqBdHsDvHuGjF_HfEoHjFoSbAaMHcL`JqGvGlGxD~IdFbGtB`LaAjMkBkJqBoKoGqEmApPf@tLpCfJ|HiCxHb@hO_AtJwBpJoClHiCxG{BlIgDhG}D~GgGfH}HlJbA~K_CnJgEnHeCxJyErIh@nHe@jJJfHoCpHyCxH{@bH{A`IJbHgA~GyA~HkCbHoGzEyHlDsJmAkK`FvFhC`J|FnEtGtBfIoAdJaAnHgAlGkF`HcDb@uKlFcHzHeElI}EzGeEfGaDfGgDcA{J_McHwBqKY_PLwTbNQpCnPFdShEfH@{[Msh@bD~MfArWHf\\lHCoBnKkB~KDbT\\pOf@iKGcP@sL|GrAfHx@~HS~SlR?_l@rl@sUvBxJ@pg@?pLdMBhSJt@uTqDib@tRiKl_Aw@lJInHkB|KqCjHiBnQoEhIuB`[eR|OqJnOiJzI}EfH}DnRoK~PqJjf@gXbLmGnK_GpIjDdFpFvBpLzG~BzGsDjHgDrEgH`IqLxEqH`JvC~MsApLiJZgLnFoFfDfIlDjLzGnBpHcCtGoD~EkHlKhChNkEhF{FlDmIhBmJn@cKfC~I`BpJtF{ErIwJrEuIxGyEfF}FbHwIdGuDnHeD|C_JnKsHvFpEbHmIxFeH~CkIvCsIlD{IlCyIhBgKQkK}BsJhCgL|FiEi@_YgIa_AsAmO|jBoBzVJzVHteA\\zYJ~LDpv@e@hI?tI~DnJUnMgAlJDfJJfIAjJBhKD~Nd@lMGn_@MnIRvO?xI?lH?bf@?le@QrHAfH?fH?|HH`JLnNMnJ_@xLTzOOD`NBxNFpf@@zNn@|Jq@fK?rQHvOEtTApKAnP?pKnBlJwCvJT|KAhLCbMCxNAjKCzKAxPA|K?`T@xLJjMBfO@lNFbNAjNA|L?lL?bM@bL?pK?`L?bL@~L@~L}JDmHAgJ?s@lLcA~JwGeCmJmDeLiC_IgA}ImAwKpHwBzJnAzOdEdJpE`JvEbJnCzIHbQ@~L?tK?tK~@f^qF`FaIOePFeBiKEeKgH{GkJHkJLmJJaAvLD~KDzKDdKD|KDdKD|KDrKEhP{IjAcHH{IJ}JJ_AnLFjNnGpEgG~CFlMFlLFzNFxKDrKGtK?fKF~KuGxC}LGeIH{HJmAzLFvNH~V}QbGqBfKpCbJnFhFhHI|@pLDhLlJ~A`IKf@bK?dN_DpIiISuEhHDbNDfKDtKFdLFrLDjLFbNH`PJnUH`NFlN_Hz@iLPeJLuIHi@}M?}M?k]UgNQkKa@uOEiNeIYuHRaH@kHLsJN_IHuLLeOVkHH{KL{IHaHDyCqLE_LEaLEcKxGuBpJcElJK`JKdAqLEgLE{KEmKaEqKQsMNmKAkKEaNgIaBkJJkJJ}EcHCkKCsLCkKCoKgHg@eIHiKHwLLeJNoIDaHHcJHyKJsHH{ON}HHFdOF`MFjLFxNF`NFjNHrODtMFtNHtOFnLFzMF~KFhKFxPFfLDfKFzLD~KFxKFrLDtLFdNH~NBhKgH~BgKFiJLuIHgJL_KLyKLsJJ_JL{HJ}IDyLNaLNkHNqHHuIJkOJcHBiIF}HH{IH_LJ{@zLD|KHtLFrOJxODlLHzNHdMDnMHnNHvOJpMH~NHfNFlNHrMFvNFvNFtMFhNFjNFlNFjND`LeI|DcHFkIPyHJgILuJNiJNiJNkHJeHJgJNqHHcIJoIhAqOq\\C_LGgKE}KKuKIkKE_LEaLAqLIuLG_LG_LMuLIgMGmKGwKEkKA_LE_LCeKG_LE_LeH{DmJHmJHeIHsK@kJHmJEaGcGsBwJuBuJkC{L_HcCsHMqHNuIQm@eQJ{PqJaBwXTeKDyIAgJDwKh@iH]mO\\cMNsKBaKLcQNwHHgHPwLZgINqLNeIJeHF_IAkHDyHJm@zMBfKDfKDdKFfNDhNFfNDtMDzKDvKDvKHvNDhNFjNDjNcHz@kJJeHD_KRuIJoJJqIJwKNiIH}HHgHHkQRgHHcHFaIHoHHyHH}HJ_IH}HHkLJcHHuLLuIJ_JJ}A~JBpKDrK@dLDtLD~LB|KBpKFhNB~KDlKDnMAtOH~KgJNmJLmJHcHHmHHmLJ}HJsJJ}HHqHHyHJeIHwHJ}IJaHH}ApJH~KFdKF~K{GtJyILmAxLHhNHfNFdLH`RHnNFhKHdOFrKF~KLfRFpMFpLHpKyEnHkLpE{KxCyGbB_HtB_I~CmHbBcHkByGwKq@sZ_MgC{DtL^jKoD~K^nRwCxIcJe@iIiEcHeDsGaDaICcIuCiI]eH\\uI{CcIrAOnLlCpJ{BvJmFzFB~LJrNFrKJjLFrN?lKEpK@xUxKCrXGnGhHHnR@a\\lLCzJCdOMhHQb@fLgAdLc@xKe@zKnCvI|K[dBbPlK{AhIEdAbUw@lYi@bQgAhQgA|J_EbUoCrOoO?mFfF{AlKaA|M]lK~UN`@`Sm[`E}Cf^w]zC?hKsLnFhFdHzEdOgLdAiMDmPFgHBmO@cH@{f@JaQHsi@VkJaImJkDsIsEvGjEkCfOsHDiGaNM_MwLa@uLF_MK_BeKlLa@zD_KTgKgMsV`FoOtLiK_HeL_Oc]zH}DvFqIHyMwNgIcFgKnAuQxBqMtBkK|CuJdDmJlH_@o@eKfC_LdGrQS|f@oI`VfO{VK{SbHGZeN~@mMbAmL|BaQfEoIfI@pCoSzQsLbHeBlJaCjHaCxHiC|IkF`Ji@`HiAfXmHVxK~LjBbBqQCwLLcLP}KMsLMoKaHkBuFoFcFwFqFkGmF}GuHmDyG~AcIdBwH}AoHmCuCqIPaLh@gLbAiMbAkMdAuMfAgNhA_Nx@mKv@_Lt@cKdAgNv@mKv@_Kv@yK_HaA}Hi@sHi@uIm@uIm@kLcAeH{@_Hg@qHAaHAoIEeICuLAkHCaJCwKE",
	"_|m}FlcfvOcHHmJLkJJmJJcAzW`H|DnJGbOSdHOEeOEwM",
	"aae_Ghe`wOJpLnEbHCrVuEdH_GxDZhNpCtWbCoLxMeBtFyFHpMDzKaHhB{@pQElKvJBhI?fI?z@uNGqMGyKEkKvGcEtHAzI?lJ?`CqL`A_KfHkAlIeAxHIpIExAwLK{MIgKKyKIuKIyMIkKKuLIqLKqNK_NcHoEcGcPoFqNmEmL_DqI}EoMwAkOE{KGwLiI_HqHa@{RPuI@{BpJL|KJrL@rL?bN?dNExK|AzJ@fK}GhGkKGmHEgGdEJjNH~KJdLHhKfIt@rH@uItJwGtBHdKJ`L",
	"_ve_Gpd`wOcHe@uHg@gIi@aElHlE|NaHxAs@dKBjKnF~H~DlHbFiJ?uSdEmHdFvGhFzFN`MhD{IPyWH}PwGaC",
	"mef_GjobwO??"
], chicagoCursor = -1, chicagoShape = [];
while(++chicagoCursor < chicago.length) 
	chicagoShape.push(polylineDecode(chicago[chicagoCursor]));

console.log(chicagoShape);