import * as cheerio from 'cheerio';
import { v5 as uuidv5 } from 'uuid';

const COOKIE = "v_udt=NVNJbkFja0NBTG85UFA5VXlXa1ZHenVTSkhZSy0tQnpiSW5iY2RZbXNVMmkxZy0tWjB6N0diM0o5dkNhTWpUTVJlYUx1QT09; anonymous-locale=fr; is_shipping_fees_applied_info_banner_dismissed=false; OptanonAlertBoxClosed=2026-01-20T16:20:59.354Z; eupubconsent-v2=CQeUypgQeUypgAcABBFRCOFsAP_gAEPgAAwILNtR_G__bWlr-Tb3afpkeYxP99hr7sQxBgbJk24FzLvW7JwSx2E5NAzatqIKmRIAu3TBIQNlHJDURVCgKIgFryDMaEyUoTNKJ6BkiBMRI2JYCFxvm4pjWQCY4vr99lc1mB-N7dr82dzyy4hHn3a5_2S1UJCdIYetDfn8ZBKT-9IEd_x8v4v4_EbpE2-eS1n_pGvp4j9-YlM_dBmxt-TSffzPn_frk_e7X_vc_n3zv84XH77v_4LMgAmGhUQRlkQABAoGAECABQVhABQIAgAASBogIATBgQ5AwAXWEyAEAKAAYIAQAAgwABAAAJAAhEAFABAIAQIBAoAAwAIAgIAGBgADABYiAQAAgOgYpgQQCBYAJGZVBpgSgAJBAS2VCCQBAgrhCEWeAQQIiYKAAAEAAoAAAB4LAQkkBKxIIAuIJoAACAAAKIECBFIWYAgoDNFoKwJOAyNMAwfMEySnQZAEwQkZBkQm_CYeKQogAAAA.f_wACHwAAAAA.ILNtR_G__bXlv-Tb36fpkeYxf99hr7sQxBgbJs24FzLvW7JwS32E7NEzatqYKmRIAu3TBIQNtHJjURVChKIgVrzDsaEyUoTtKJ-BkiDMRY2JYCFxvm4pjWQCZ4vr_91d9mT-N7dr-2dzyy5hnv3a9_-S1UJidKYetHfn8ZBKT-_IU9_x-_4v4_MbpE2-eS1v_tGvt439-4tP_dpuxt-Tyffz___f72_e7X__c__33_-_Xf_7__4A; OTAdditionalConsentString=1~43.55.61.70.83.89.93.108.117.122.124.135.143.144.147.149.159.192.196.211.228.230.239.259.266.286.291.311.320.322.323.327.367.371.385.394.407.415.424.430.436.445.486.491.494.495.522.523.540.550.560.568.574.576.584.587.591.737.803.820.839.864.899.904.922.938.959.979.981.985.1003.1027.1031.1046.1051.1053.1067.1092.1095.1097.1099.1107.1109.1135.1143.1149.1152.1162.1166.1186.1188.1205.1215.1226.1227.1230.1252.1268.1270.1276.1284.1290.1301.1307.1312.1329.1345.1356.1403.1415.1416.1421.1423.1440.1449.1455.1495.1512.1516.1525.1540.1548.1555.1558.1570.1577.1579.1583.1584.1603.1616.1638.1651.1653.1659.1667.1677.1678.1682.1697.1699.1703.1712.1716.1721.1725.1732.1745.1750.1765.1782.1786.1800.1810.1825.1827.1832.1838.1840.1842.1843.1845.1859.1870.1878.1880.1889.1917.1929.1942.1944.1962.1963.1964.1967.1968.1969.1978.1985.1987.2003.2027.2035.2039.2047.2052.2056.2064.2068.2072.2074.2088.2090.2103.2107.2109.2115.2124.2130.2133.2135.2137.2140.2147.2156.2166.2177.2186.2205.2213.2216.2219.2220.2222.2225.2234.2253.2275.2279.2282.2309.2312.2316.2322.2325.2328.2331.2335.2336.2343.2354.2358.2359.2370.2376.2377.2387.2400.2403.2405.2407.2411.2414.2416.2418.2425.2440.2447.2461.2465.2468.2472.2477.2484.2486.2488.2498.2510.2517.2526.2527.2532.2535.2542.2552.2563.2564.2567.2568.2569.2571.2572.2575.2577.2583.2584.2596.2604.2605.2608.2609.2610.2612.2614.2621.2627.2628.2629.2633.2636.2642.2643.2645.2646.2650.2651.2652.2656.2657.2658.2660.2661.2669.2670.2677.2681.2684.2687.2690.2695.2698.2713.2714.2729.2739.2767.2768.2770.2772.2784.2787.2791.2792.2798.2801.2805.2812.2813.2816.2817.2821.2822.2827.2830.2831.2833.2834.2838.2839.2844.2846.2849.2850.2852.2854.2860.2862.2863.2865.2867.2869.2874.2875.2876.2878.2880.2881.2882.2884.2886.2887.2888.2889.2891.2893.2894.2895.2897.2898.2900.2901.2908.2909.2916.2917.2918.2920.2922.2923.2927.2929.2930.2931.2940.2941.2947.2949.2950.2956.2958.2961.2963.2964.2965.2966.2968.2973.2975.2979.2980.2981.2983.2985.2986.2987.2994.2995.2997.2999.3000.3002.3003.3005.3008.3009.3010.3012.3016.3017.3018.3019.3028.3034.3038.3043.3052.3053.3055.3058.3059.3063.3066.3068.3070.3073.3074.3075.3076.3077.3089.3090.3093.3094.3095.3097.3099.3100.3106.3109.3112.3117.3119.3126.3127.3128.3130.3135.3136.3145.3150.3151.3154.3155.3163.3167.3172.3173.3182.3183.3184.3185.3187.3188.3189.3190.3194.3196.3209.3210.3211.3214.3215.3217.3222.3223.3225.3226.3227.3228.3230.3231.3234.3235.3236.3237.3238.3240.3244.3245.3250.3251.3253.3257.3260.3270.3272.3281.3288.3290.3292.3293.3296.3299.3300.3306.3307.3309.3314.3315.3316.3318.3324.3328.3330.3331.3531.3731.3831.4131.4531.4631.4731.4831.5231.6931.7235.7831.7931.8931.9731.10231.10631.10831.11031.11531.13632.14034.14133.14237.14332.15731.16831.16931.21233.23031.25131.25931.26031.26631.26831.27731.27831.28031.28731.28831.29631.32531.33931.34231.34631.36831.39131.39531.40632.41131.41531.43631.43731.43831.45931.46031.47232.47531.48131.49231.49332.49431.50831.52831; _lm_id=7BMMXWIW6P5MJXYH; _gcl_au=1.1.1861032269.1768926060; _ga=GA1.1.610336872.1768926060; __ps_r=https://fr.search.yahoo.com/; __ps_lu=https://www.vinted.fr/; __ps_did=pscrb_86bd4cb6-bb9b-4543-c352-e08c8fcdff55; __ps_fva=1768926060066; _fbp=fb.1.1768926060272.496520507595036368; domain_selected=true; _cc_id=d4419dbdc392a98aa6ebb69e02d0dc45; sharedid=c02fc9ad-f5a8-4f6c-9411-ee967459bea5; sharedid_cst=ycypBQ%3D%3D; pbjs-id5id_cst=ycypBQ%3D%3D; pbjs-id5id_last=Tue%2C%2020%20Jan%202026%2016%3A23%3A11%20GMT; _pubcid=8900e04d-9884-4f0d-a793-b7e1caca80f1; __gads=ID=3f843bbe6d8f74cd:T=1768926067:RT=1773147657:S=ALNI_MYimP7ftQvS5MvY_TLDvNIFgIIjFg; __eoi=ID=61cfa73c6123d4d7:T=1768926067:RT=1773147657:S=AA-AfjYOCuEHIMRN8IvOwd-0yu5C; anonymous-iso-locale=fr-FR; non_dot_com_www_domain_cookie_buster=1; v_sid=66c9e8d97f52d428c2aae2736144720c; cf_clearance=p7.GoTl.m4aQUwBtQM9CBEs8RCooTIoq756iTFqDSao-1775908691-1.2.1.1-CeyWPq4eyl352le3P1RKxgramM4N89x1gC0vx9Nms8brD5WfD1oT.QLuTcUPkiHqGWprpGoCdq.B8Q6jtuF.nZgohp.HtqAUuAlBRKC3iuG7dTi7q2j6GAFsxnDE0x_b5Btq71GqctYs_ql3hnkcQvePKuZuq5HVYdZQhJGr0AkE5e7WFMFF8AKM8eXvpFA2bLukYLZFDNWuAXEpxO4gTojI9.nhCjqoknjaz5t3nlC77wExvNKMVWLC6x62ASffxPhPcfcPXUmV.buNEbAOuqy.8YD8IRTkB2UD8MybwLCLDpXoQZhXQPJiBcbpjV2p1gubp6OwDAV8_VlD06VHDw; __cf_bm=RzPtenfZHrAm_4JtJ8FQphhyAPHB2fa3B.Unq1DV.KU-1775908691.2533643-1.0.1.1-FLt7q_kHAN5QrMh9bQuLFDaxTIVVegGCaT4PYA5JLw3ClRpi4aYYmFdbpIqxDPg.HDBwf7tCj5dyiHs7_IqQJz8MZ7mfrifZrxDffAktMi1N0ceDEqrFYohEI69QF0H8CVxSeWfVcZ0.rYiAqY08rw; consent_version=eu; __ps_sr=_; __ps_slu=https://www.vinted.fr/; fs_lua=1.1775908724795; fs_uid=#o-2PZB-eu1#77a1c580-d2ea-4c4a-bef9-dbca7876a177:f67f38e9-d324-4a68-8de4-f5c55cc0832d:1775908697662::2###/1807444702; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhY2NvdW50X2lkIjoyMTI2NDg0MCwiYXBwX2lkIjo0LCJhdWQiOiJmci5jb3JlLmFwaSIsImNsaWVudF9pZCI6IndlYiIsImV4cCI6MTc3NjUxMzUzMywiaWF0IjoxNzc1OTA4NzMzLCJpc3MiOiJ2aW50ZWQtaWFtLXNlcnZpY2UiLCJwdXJwb3NlIjoicmVmcmVzaCIsInNjb3BlIjoidXNlciIsInNpZCI6IjZmOTZkYmNlLTE3NzU5MDg3MzMiLCJzdWIiOiIzNzE1ODc5OCIsImNjIjoiRlIiLCJhbmlkIjoiODIxZGJkMzQtMzFkYy00OWQzLWE2YmYtOTEzYjBiZTBmMzkxIiwiYWN0Ijp7InN1YiI6IjM3MTU4Nzk4In19.NR-8B56-MMsfVZFhVYHcHr0-rD77k7rMrpZJb9KtS9E6S1x0H1rrYbO0yLv1kHATFHdYHoWRZzzz7bzQoomnJfBMmJmaC-vNqeISm6sCiIsEf08_6ybGIdz9Suqx_98rq81BIlPxa0YjzcMcpL1LQMJkpeZ4b6kneSeSlsEVtbTDeosqNSLfgPbyeqIdLmxSIs99VQe490DDuaht5JCj9UD-AO2B-n8-0ZGmjm3NHxXrsl71sdL2aU4Nk3a7ousH2lykEdLYSb0lznrkq6tcXei5n-kRqelVeFYniHuOgqeNmqeGYWbM6KGNHeUIMKQs3zDOWFVgdOUDjrHCYNjtHw; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhY2NvdW50X2lkIjoyMTI2NDg0MCwiYXBwX2lkIjo0LCJhdWQiOiJmci5jb3JlLmFwaSIsImNsaWVudF9pZCI6IndlYiIsImV4cCI6MTc3NTkxNTkzMywiaWF0IjoxNzc1OTA4NzMzLCJpc3MiOiJ2aW50ZWQtaWFtLXNlcnZpY2UiLCJwdXJwb3NlIjoiYWNjZXNzIiwic2NvcGUiOiJ1c2VyIiwic2lkIjoiNmY5NmRiY2UtMTc3NTkwODczMyIsInN1YiI6IjM3MTU4Nzk4IiwiY2MiOiJGUiIsImFuaWQiOiI4MjFkYmQzNC0zMWRjLTQ5ZDMtYTZiZi05MTNiMGJlMGYzOTEiLCJhbXIiOlsibWZhIiwic21zIl0sImFjdCI6eyJzdWIiOiIzNzE1ODc5OCJ9fQ.quMncpwskNp9k-sagIjJsWQ1uzsnI9_3MUSY24LrlUH8csOrRZpwsMgyQdIDzNLSGTilS6pWqb7MtHr_Pna6oEDW6JDv72xGcf8q6ogpLJZCtHigCuS7NQBEqgvkpC80GZ4d--97tEccsNIzECCgmedirJZZXsR4Yx9zWGjHB8xR56twKS5d2AqF0VhU2KuRRMkbAMCMAid7ua0aPC07kJWSiMra-bp10RkW1S488gtp0AzDtOFr8M81e1S4k3sm6MOmVAkLZ6sMpJcZOadJjnZqF03Jn3ojZqTDEXroJR-IUUqXJLheGqAsMIxD3VppCJAtEnD6tjsmgb5xH2wfgA; anon_id=821dbd34-31dc-49d3-a6bf-913b0be0f391; user-locale=fr; user-iso-locale=fr-FR; v_uid=37158798; v_sid=6f96dbce-1775908733; OptanonConsent=isGpcEnabled=0&datestamp=Sat+Apr+11+2026+13%3A59%3A31+GMT%2B0200+(heure+d%E2%80%99%C3%A9t%C3%A9+d%E2%80%99Europe+centrale)&version=202602.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=37158798&isAnonUser=1&hosts=&interactionCount=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1%2CC0005%3A1%2CV2STACK42%3A1%2CC0035%3A1%2CC0038%3A1&genVendors=V2%3A1%2CV1%3A1%2C&intType=1&geolocation=FR%3BIDF&AwaitingReconsent=false&prevHadToken=0; _ga_ZJHK1N3D75=GS2.1.s1775908696$o5$g1$t1775908772$j57$l0$h0; _ga_8H12QY46R8=GS2.1.s1775908696$o5$g1$t1775908773$j56$l0$h0; banners_ui_state=SUCCESS; _vinted_fr_session=UzVrT3lBbmJWL3FzVGQrYzNVNXlHMVZDY0lGK2k4eVhzUXMzZ3ZCcklKUFFHcmFOYlhFTk5nWWpWckhWMHBWaHpvSmhlSDFLNWhSN3l4Z2Q2YlpEa0dhb21SWENxaTV1S2NQUUdDWThDM2FXK2JNMDFtRDRSOGpWSkdtNTlIdmxpYlBFZFl5MkxyU1cvUE0wRGNnb0JTbEs5b09sUHZENDhqTm1ncHdOL1dKYjR6NlA3Zjg0ZVBKdDM1eGNaUzFkQ2hleW1ZWE1XSCtDS3h4dm5qWC8xSHF2UXk5dzl4NlJOVlFoUG9xRy9KSVc2M3V5QVZWNUtVV1JqaVFSMWF1SS0tK1FEU0psd0RpakNxMEcyblJpMis5QT09--a9681ac2873629780f256bb9ccb3c23ea12488e4; cto_bidid=eaGZu19lRU15SUx5Z3doNmRXS1JZYkdtSWR0QUFkMWRwJTJCb0Q5c2JrU0pyR2N1MEY0M1Jya3EzcWVnbGQwbHdHZjlHSVh4bmd2cW90UHR0RW9EZHBwNFglMkJyamJPJTJCaUs0bFo5UFlCcnhVZXBtVG5tWSUzRA; datadome=u~e4dY1uP1cjuUIYK1oQ5~SueeM8kFaLAzQMCiTe9mxXITrBD1ihk0OowW1KpugNqFctdQjXq1UwzwBLP~Y9dBH~7Bb95NfEe6A0pLs1Li9Jvm9Ey5uCN~T9y2bBOlyx; panoramaId_expiry=1776513635824; panoramaId=3d06daceb476eacd7d75457a93d1185ca02cd0cdfbe76042eccbf2a7c0353a42; panoramaIdType=panoDevice; cto_bundle=KT_VGl8xJTJCdFlJcVolMkZqZnRzWnBOZ2xHYnhLTE1Xd2JpSlZBJTJCY2MlMkJWRnhBSkp5djZXU0VBRVdoa29wTEhKblI3WTFzYmwxUHpTNVVtRDl4WUJBbmt0dVc5QmlISzUxZ1A2MFpFUkltUjl3a1c5WE1XNHYwZUlLYkYwbDdZNFJPSHhVNmczVlh3eSUyRmtSNTdpNFlZMm52SVJKR0RnJTNEJTNE; viewport_size=245";

function isNotDefined(value) {
  return (value == null || (typeof value === "string" && value.trim().length === 0));
}

/**
 * Parse  
 * @param  {String} data - json response
 * @return {Object} sales
 */
const parse = data => {
  try {
    const {items} = data;

    return items.map(item => {
      const link = item.url;
      const price = item.total_item_price;
      const {photo} = item;
      const published = photo.high_resolution && photo.high_resolution.timestamp;

      return {
        link,
        price,
        title: item.title,
        published,
        'uuid': uuidv5(link, uuidv5.URL)
      }
    })
  } catch (error){
    console.error(error);
    return [];
  }
}



const scrape = async searchText => {
  try {

    if (isNotDefined(COOKIE)) {
      throw "vinted requires a valid cookie";
    }

    const response = await fetch(`https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=96&time=1727382549&search_text=${searchText}&catalog_ids=&size_ids=&brand_ids=89162&status_ids=6,1&material_ids`, {
      "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
        "cache-control": "no-cache",
        "pragma": "no-cache",
        "priority": "u=0, i",
        "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "cookie": COOKIE
      },
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": null,
      "method": "GET"
    });

    if (response.ok) {
      const body = await response.json();

      return parse(body);
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};


export {scrape};