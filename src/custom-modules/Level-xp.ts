import { MaxLevel, XpEmoji } from "../docs/CommandSettings";
import { Functions } from "../structures/Functions";

export class Levels {
    private static levels = levels();
    
    static levelFor(xp: number): number {
        const f = Functions;
        let lvl = 1;
        for (let i in this.levels) {
            if (this.levels[i] > xp) {
                lvl = +i - 1
                break;
            };
        }
        return lvl > MaxLevel ? MaxLevel : lvl;
    }

    static xpFor(level: number) {
        return this.levels[`${level}`];
    }
}

function levels () {
    return {
        "1": 0,
        "2": 100,
        "3": 300,
        "4": 600,
        "5": 1000,
        "6": 1500,
        "7": 2100,
        "8": 2800,
        "9": 3600,
        "10": 4500,
        "11": 5500,
        "12": 6600,
        "13": 7800,
        "14": 9100,
        "15": 10500,
        "16": 12000,
        "17": 13600,
        "18": 15300,
        "19": 17100,
        "20": 19000,
        "21": 21000,
        "22": 23100,
        "23": 25300,
        "24": 27600,
        "25": 30000,
        "26": 32500,
        "27": 35100,
        "28": 37800,
        "29": 40600,
        "30": 43500,
        "31": 46500,
        "32": 49600,
        "33": 52800,
        "34": 56100,
        "35": 59500,
        "36": 63000,
        "37": 66600,
        "38": 70300,
        "39": 74100,
        "40": 78000,
        "41": 82000,
        "42": 86100,
        "43": 90300,
        "44": 94600,
        "45": 99000,
        "46": 103500,
        "47": 108100,
        "48": 112800,
        "49": 117600,
        "50": 122500,
        "51": 127500,
        "52": 132600,
        "53": 137800,
        "54": 143100,
        "55": 148500,
        "56": 154000,
        "57": 159600,
        "58": 165300,
        "59": 171100,
        "60": 177000,
        "61": 183000,
        "62": 189100,
        "63": 195300,
        "64": 201600,
        "65": 208000,
        "66": 214500,
        "67": 221100,
        "68": 227800,
        "69": 234600,
        "70": 241500,
        "71": 248500,
        "72": 255600,
        "73": 262800,
        "74": 270100,
        "75": 277500,
        "76": 285000,
        "77": 292600,
        "78": 300300,
        "79": 308100,
        "80": 316000,
        "81": 324000,
        "82": 332100,
        "83": 340300,
        "84": 348600,
        "85": 357000,
        "86": 365500,
        "87": 374100,
        "88": 382800,
        "89": 391600,
        "90": 400500,
        "91": 409500,
        "92": 418600,
        "93": 427800,
        "94": 437100,
        "95": 446500,
        "96": 456000,
        "97": 465600,
        "98": 475300,
        "99": 485100,
        "100": 495000,
        "101": 505000,
        "102": 515100,
        "103": 525300,
        "104": 535600,
        "105": 546000,
        "106": 556500,
        "107": 567100,
        "108": 577800,
        "109": 588600,
        "110": 599500,
        "111": 610500,
        "112": 621600,
        "113": 632800,
        "114": 644100,
        "115": 655500,
        "116": 667000,
        "117": 678600,
        "118": 690300,
        "119": 702100,
        "120": 714000,
        "121": 726000,
        "122": 738100,
        "123": 750300,
        "124": 762600,
        "125": 775000,
        "126": 787500,
        "127": 800100,
        "128": 812800,
        "129": 825600,
        "130": 838500,
        "131": 851500,
        "132": 864600,
        "133": 877800,
        "134": 891100,
        "135": 904500,
        "136": 918000,
        "137": 931600,
        "138": 945300,
        "139": 959100,
        "140": 973000,
        "141": 987000,
        "142": 1001100,
        "143": 1015300,
        "144": 1029600,
        "145": 1044000,
        "146": 1058500,
        "147": 1073100,
        "148": 1087800,
        "149": 1102600,
        "150": 1117500,
        "151": 1132500,
        "152": 1147600,
        "153": 1162800,
        "154": 1178100,
        "155": 1193500,
        "156": 1209000,
        "157": 1224600,
        "158": 1240300,
        "159": 1256100,
        "160": 1272000,
        "161": 1288000,
        "162": 1304100,
        "163": 1320300,
        "164": 1336600,
        "165": 1353000,
        "166": 1369500,
        "167": 1386100,
        "168": 1402800,
        "169": 1419600,
        "170": 1436500,
        "171": 1453500,
        "172": 1470600,
        "173": 1487800,
        "174": 1505100,
        "175": 1522500,
        "176": 1540000,
        "177": 1557600,
        "178": 1575300,
        "179": 1593100,
        "180": 1611000,
        "181": 1629000,
        "182": 1647100,
        "183": 1665300,
        "184": 1683600,
        "185": 1702000,
        "186": 1720500,
        "187": 1739100,
        "188": 1757800,
        "189": 1776600,
        "190": 1795500,
        "191": 1814500,
        "192": 1833600,
        "193": 1852800,
        "194": 1872100,
        "195": 1891500,
        "196": 1911000,
        "197": 1930600,
        "198": 1950300,
        "199": 1970100,
        "200": 1990000,
        "201": 2010000,
        "202": 2030100,
        "203": 2050300,
        "204": 2070600,
        "205": 2091000,
        "206": 2111500,
        "207": 2132100,
        "208": 2152800,
        "209": 2173600,
        "210": 2194500,
        "211": 2215500,
        "212": 2236600,
        "213": 2257800,
        "214": 2279100,
        "215": 2300500,
        "216": 2322000,
        "217": 2343600,
        "218": 2365300,
        "219": 2387100,
        "220": 2409000,
        "221": 2431000,
        "222": 2453100,
        "223": 2475300,
        "224": 2497600,
        "225": 2520000,
        "226": 2542500,
        "227": 2565100,
        "228": 2587800,
        "229": 2610600,
        "230": 2633500,
        "231": 2656500,
        "232": 2679600,
        "233": 2702800,
        "234": 2726100,
        "235": 2749500,
        "236": 2773000,
        "237": 2796600,
        "238": 2820300,
        "239": 2844100,
        "240": 2868000,
        "241": 2892000,
        "242": 2916100,
        "243": 2940300,
        "244": 2964600,
        "245": 2989000,
        "246": 3013500,
        "247": 3038100,
        "248": 3062800,
        "249": 3087600,
        "250": 3112500,
        "251": 3137500,
        "252": 3162600,
        "253": 3187800,
        "254": 3213100,
        "255": 3238500,
        "256": 3264000,
        "257": 3289600,
        "258": 3315300,
        "259": 3341100,
        "260": 3367000,
        "261": 3393000,
        "262": 3419100,
        "263": 3445300,
        "264": 3471600,
        "265": 3498000,
        "266": 3524500,
        "267": 3551100,
        "268": 3577800,
        "269": 3604600,
        "270": 3631500,
        "271": 3658500,
        "272": 3685600,
        "273": 3712800,
        "274": 3740100,
        "275": 3767500,
        "276": 3795000,
        "277": 3822600,
        "278": 3850300,
        "279": 3878100,
        "280": 3906000,
        "281": 3934000,
        "282": 3962100,
        "283": 3990300,
        "284": 4018600,
        "285": 4047000,
        "286": 4075500,
        "287": 4104100,
        "288": 4132800,
        "289": 4161600,
        "290": 4190500,
        "291": 4219500,
        "292": 4248600,
        "293": 4277800,
        "294": 4307100,
        "295": 4336500,
        "296": 4366000,
        "297": 4395600,
        "298": 4425300,
        "299": 4455100,
        "300": 4485000,
        "301": 4515000,
        "302": 4545100,
        "303": 4575300,
        "304": 4605600,
        "305": 4636000,
        "306": 4666500,
        "307": 4697100,
        "308": 4727800,
        "309": 4758600,
        "310": 4789500,
        "311": 4820500,
        "312": 4851600,
        "313": 4882800,
        "314": 4914100,
        "315": 4945500,
        "316": 4977000,
        "317": 5008600,
        "318": 5040300,
        "319": 5072100,
        "320": 5104000,
        "321": 5136000,
        "322": 5168100,
        "323": 5200300,
        "324": 5232600,
        "325": 5265000,
        "326": 5297500,
        "327": 5330100,
        "328": 5362800,
        "329": 5395600,
        "330": 5428500,
        "331": 5461500,
        "332": 5494600,
        "333": 5527800,
        "334": 5561100,
        "335": 5594500,
        "336": 5628000,
        "337": 5661600,
        "338": 5695300,
        "339": 5729100,
        "340": 5763000,
        "341": 5797000,
        "342": 5831100,
        "343": 5865300,
        "344": 5899600,
        "345": 5934000,
        "346": 5968500,
        "347": 6003100,
        "348": 6037800,
        "349": 6072600,
        "350": 6107500,
        "351": 6142500,
        "352": 6177600,
        "353": 6212800,
        "354": 6248100,
        "355": 6283500,
        "356": 6319000,
        "357": 6354600,
        "358": 6390300,
        "359": 6426100,
        "360": 6462000,
        "361": 6498000,
        "362": 6534100,
        "363": 6570300,
        "364": 6606600,
        "365": 6643000,
        "366": 6679500,
        "367": 6716100,
        "368": 6752800,
        "369": 6789600,
        "370": 6826500,
        "371": 6863500,
        "372": 6900600,
        "373": 6937800,
        "374": 6975100,
        "375": 7012500,
        "376": 7050000,
        "377": 7087600,
        "378": 7125300,
        "379": 7163100,
        "380": 7201000,
        "381": 7239000,
        "382": 7277100,
        "383": 7315300,
        "384": 7353600,
        "385": 7392000,
        "386": 7430500,
        "387": 7469100,
        "388": 7507800,
        "389": 7546600,
        "390": 7585500,
        "391": 7624500,
        "392": 7663600,
        "393": 7702800,
        "394": 7742100,
        "395": 7781500,
        "396": 7821000,
        "397": 7860600,
        "398": 7900300,
        "399": 7940100,
        "400": 7980000,
        "401": 8020000,
        "402": 8060100,
        "403": 8100300,
        "404": 8140600,
        "405": 8181000,
        "406": 8221500,
        "407": 8262100,
        "408": 8302800,
        "409": 8343600,
        "410": 8384500,
        "411": 8425500,
        "412": 8466600,
        "413": 8507800,
        "414": 8549100,
        "415": 8590500,
        "416": 8632000,
        "417": 8673600,
        "418": 8715300,
        "419": 8757100,
        "420": 8799000,
        "421": 8841000,
        "422": 8883100,
        "423": 8925300,
        "424": 8967600,
        "425": 9010000,
        "426": 9052500,
        "427": 9095100,
        "428": 9137800,
        "429": 9180600,
        "430": 9223500,
        "431": 9266500,
        "432": 9309600,
        "433": 9352800,
        "434": 9396100,
        "435": 9439500,
        "436": 9483000,
        "437": 9526600,
        "438": 9570300,
        "439": 9614100,
        "440": 9658000,
        "441": 9702000,
        "442": 9746100,
        "443": 9790300,
        "444": 9834600,
        "445": 9879000,
        "446": 9923500,
        "447": 9968100,
        "448": 10012800,
        "449": 10057600,
        "450": 10102500,
        "451": 10147500,
        "452": 10192600,
        "453": 10237800,
        "454": 10283100,
        "455": 10328500,
        "456": 10374000,
        "457": 10419600,
        "458": 10465300,
        "459": 10511100,
        "460": 10557000,
        "461": 10603000,
        "462": 10649100,
        "463": 10695300,
        "464": 10741600,
        "465": 10788000,
        "466": 10834500,
        "467": 10881100,
        "468": 10927800,
        "469": 10974600,
        "470": 11021500,
        "471": 11068500,
        "472": 11115600,
        "473": 11162800,
        "474": 11210100,
        "475": 11257500,
        "476": 11305000,
        "477": 11352600,
        "478": 11400300,
        "479": 11448100,
        "480": 11496000,
        "481": 11544000,
        "482": 11592100,
        "483": 11640300,
        "484": 11688600,
        "485": 11737000,
        "486": 11785500,
        "487": 11834100,
        "488": 11882800,
        "489": 11931600,
        "490": 11980500,
        "491": 12029500,
        "492": 12078600,
        "493": 12127800,
        "494": 12177100,
        "495": 12226500,
        "496": 12276000,
        "497": 12325600,
        "498": 12375300,
        "499": 12425100,
        "500": 12475000,
        "501": 12525000,
        "502": 12575100,
        "503": 12625300,
        "504": 12675600,
        "505": 12726000,
        "506": 12776500,
        "507": 12827100,
        "508": 12877800,
        "509": 12928600,
        "510": 12979500,
        "511": 13030500,
        "512": 13081600,
        "513": 13132800,
        "514": 13184100,
        "515": 13235500,
        "516": 13287000,
        "517": 13338600,
        "518": 13390300,
        "519": 13442100,
        "520": 13494000,
        "521": 13546000,
        "522": 13598100,
        "523": 13650300,
        "524": 13702600,
        "525": 13755000,
        "526": 13807500,
        "527": 13860100,
        "528": 13912800,
        "529": 13965600,
        "530": 14018500,
        "531": 14071500,
        "532": 14124600,
        "533": 14177800,
        "534": 14231100,
        "535": 14284500,
        "536": 14338000,
        "537": 14391600,
        "538": 14445300,
        "539": 14499100,
        "540": 14553000,
        "541": 14607000,
        "542": 14661100,
        "543": 14715300,
        "544": 14769600,
        "545": 14824000,
        "546": 14878500,
        "547": 14933100,
        "548": 14987800,
        "549": 15042600,
        "550": 15097500,
        "551": 15152500,
        "552": 15207600,
        "553": 15262800,
        "554": 15318100,
        "555": 15373500,
        "556": 15429000,
        "557": 15484600,
        "558": 15540300,
        "559": 15596100,
        "560": 15652000,
        "561": 15708000,
        "562": 15764100,
        "563": 15820300,
        "564": 15876600,
        "565": 15933000,
        "566": 15989500,
        "567": 16046100,
        "568": 16102800,
        "569": 16159600,
        "570": 16216500,
        "571": 16273500,
        "572": 16330600,
        "573": 16387800,
        "574": 16445100,
        "575": 16502500,
        "576": 16560000,
        "577": 16617600,
        "578": 16675300,
        "579": 16733100,
        "580": 16791000,
        "581": 16849000,
        "582": 16907100,
        "583": 16965300,
        "584": 17023600,
        "585": 17082000,
        "586": 17140500,
        "587": 17199100,
        "588": 17257800,
        "589": 17316600,
        "590": 17375500,
        "591": 17434500,
        "592": 17493600,
        "593": 17552800,
        "594": 17612100,
        "595": 17671500,
        "596": 17731000,
        "597": 17790600,
        "598": 17850300,
        "599": 17910100,
        "600": 17970000,
        "601": 18030000,
        "602": 18090100,
        "603": 18150300,
        "604": 18210600,
        "605": 18271000,
        "606": 18331500,
        "607": 18392100,
        "608": 18452800,
        "609": 18513600,
        "610": 18574500,
        "611": 18635500,
        "612": 18696600,
        "613": 18757800,
        "614": 18819100,
        "615": 18880500,
        "616": 18942000,
        "617": 19003600,
        "618": 19065300,
        "619": 19127100,
        "620": 19189000,
        "621": 19251000,
        "622": 19313100,
        "623": 19375300,
        "624": 19437600,
        "625": 19500000,
        "626": 19562500,
        "627": 19625100,
        "628": 19687800,
        "629": 19750600,
        "630": 19813500,
        "631": 19876500,
        "632": 19939600,
        "633": 20002800,
        "634": 20066100,
        "635": 20129500,
        "636": 20193000,
        "637": 20256600,
        "638": 20320300,
        "639": 20384100,
        "640": 20448000,
        "641": 20512000,
        "642": 20576100,
        "643": 20640300,
        "644": 20704600,
        "645": 20769000,
        "646": 20833500,
        "647": 20898100,
        "648": 20962800,
        "649": 21027600,
        "650": 21092500,
        "651": 21157500,
        "652": 21222600,
        "653": 21287800,
        "654": 21353100,
        "655": 21418500,
        "656": 21484000,
        "657": 21549600,
        "658": 21615300,
        "659": 21681100,
        "660": 21747000,
        "661": 21813000,
        "662": 21879100,
        "663": 21945300,
        "664": 22011600,
        "665": 22078000,
        "666": 22144500,
        "667": 22211100,
        "668": 22277800,
        "669": 22344600,
        "670": 22411500,
        "671": 22478500,
        "672": 22545600,
        "673": 22612800,
        "674": 22680100,
        "675": 22747500,
        "676": 22815000,
        "677": 22882600,
        "678": 22950300,
        "679": 23018100,
        "680": 23086000,
        "681": 23154000,
        "682": 23222100,
        "683": 23290300,
        "684": 23358600,
        "685": 23427000,
        "686": 23495500,
        "687": 23564100,
        "688": 23632800,
        "689": 23701600,
        "690": 23770500,
        "691": 23839500,
        "692": 23908600,
        "693": 23977800,
        "694": 24047100,
        "695": 24116500,
        "696": 24186000,
        "697": 24255600,
        "698": 24325300,
        "699": 24395100,
        "700": 24465000,
        "701": 24535000,
        "702": 24605100,
        "703": 24675300,
        "704": 24745600,
        "705": 24816000,
        "706": 24886500,
        "707": 24957100,
        "708": 25027800,
        "709": 25098600,
        "710": 25169500,
        "711": 25240500,
        "712": 25311600,
        "713": 25382800,
        "714": 25454100,
        "715": 25525500,
        "716": 25597000,
        "717": 25668600,
        "718": 25740300,
        "719": 25812100,
        "720": 25884000,
        "721": 25956000,
        "722": 26028100,
        "723": 26100300,
        "724": 26172600,
        "725": 26245000,
        "726": 26317500,
        "727": 26390100,
        "728": 26462800,
        "729": 26535600,
        "730": 26608500,
        "731": 26681500,
        "732": 26754600,
        "733": 26827800,
        "734": 26901100,
        "735": 26974500,
        "736": 27048000,
        "737": 27121600,
        "738": 27195300,
        "739": 27269100,
        "740": 27343000,
        "741": 27417000,
        "742": 27491100,
        "743": 27565300,
        "744": 27639600,
        "745": 27714000,
        "746": 27788500,
        "747": 27863100,
        "748": 27937800,
        "749": 28012600,
        "750": 28087500,
        "751": 28162500,
        "752": 28237600,
        "753": 28312800,
        "754": 28388100,
        "755": 28463500,
        "756": 28539000,
        "757": 28614600,
        "758": 28690300,
        "759": 28766100,
        "760": 28842000,
        "761": 28918000,
        "762": 28994100,
        "763": 29070300,
        "764": 29146600,
        "765": 29223000,
        "766": 29299500,
        "767": 29376100,
        "768": 29452800,
        "769": 29529600,
        "770": 29606500,
        "771": 29683500,
        "772": 29760600,
        "773": 29837800,
        "774": 29915100,
        "775": 29992500,
        "776": 30070000,
        "777": 30147600,
        "778": 30225300,
        "779": 30303100,
        "780": 30381000,
        "781": 30459000,
        "782": 30537100,
        "783": 30615300,
        "784": 30693600,
        "785": 30772000,
        "786": 30850500,
        "787": 30929100,
        "788": 31007800,
        "789": 31086600,
        "790": 31165500,
        "791": 31244500,
        "792": 31323600,
        "793": 31402800,
        "794": 31482100,
        "795": 31561500,
        "796": 31641000,
        "797": 31720600,
        "798": 31800300,
        "799": 31880100,
        "800": 31960000,
        "801": 32040000,
        "802": 32120100,
        "803": 32200300,
        "804": 32280600,
        "805": 32361000,
        "806": 32441500,
        "807": 32522100,
        "808": 32602800,
        "809": 32683600,
        "810": 32764500,
        "811": 32845500,
        "812": 32926600,
        "813": 33007800,
        "814": 33089100,
        "815": 33170500,
        "816": 33252000,
        "817": 33333600,
        "818": 33415300,
        "819": 33497100,
        "820": 33579000,
        "821": 33661000,
        "822": 33743100,
        "823": 33825300,
        "824": 33907600,
        "825": 33990000,
        "826": 34072500,
        "827": 34155100,
        "828": 34237800,
        "829": 34320600,
        "830": 34403500,
        "831": 34486500,
        "832": 34569600,
        "833": 34652800,
        "834": 34736100,
        "835": 34819500,
        "836": 34903000,
        "837": 34986600,
        "838": 35070300,
        "839": 35154100,
        "840": 35238000,
        "841": 35322000,
        "842": 35406100,
        "843": 35490300,
        "844": 35574600,
        "845": 35659000,
        "846": 35743500,
        "847": 35828100,
        "848": 35912800,
        "849": 35997600,
        "850": 36082500,
        "851": 36167500,
        "852": 36252600,
        "853": 36337800,
        "854": 36423100,
        "855": 36508500,
        "856": 36594000,
        "857": 36679600,
        "858": 36765300,
        "859": 36851100,
        "860": 36937000,
        "861": 37023000,
        "862": 37109100,
        "863": 37195300,
        "864": 37281600,
        "865": 37368000,
        "866": 37454500,
        "867": 37541100,
        "868": 37627800,
        "869": 37714600,
        "870": 37801500,
        "871": 37888500,
        "872": 37975600,
        "873": 38062800,
        "874": 38150100,
        "875": 38237500,
        "876": 38325000,
        "877": 38412600,
        "878": 38500300,
        "879": 38588100,
        "880": 38676000,
        "881": 38764000,
        "882": 38852100,
        "883": 38940300,
        "884": 39028600,
        "885": 39117000,
        "886": 39205500,
        "887": 39294100,
        "888": 39382800,
        "889": 39471600,
        "890": 39560500,
        "891": 39649500,
        "892": 39738600,
        "893": 39827800,
        "894": 39917100,
        "895": 40006500,
        "896": 40096000,
        "897": 40185600,
        "898": 40275300,
        "899": 40365100,
        "900": 40455000,
        "901": 40545000,
        "902": 40635100,
        "903": 40725300,
        "904": 40815600,
        "905": 40906000,
        "906": 40996500,
        "907": 41087100,
        "908": 41177800,
        "909": 41268600,
        "910": 41359500,
        "911": 41450500,
        "912": 41541600,
        "913": 41632800,
        "914": 41724100,
        "915": 41815500,
        "916": 41907000,
        "917": 41998600,
        "918": 42090300,
        "919": 42182100,
        "920": 42274000,
        "921": 42366000,
        "922": 42458100,
        "923": 42550300,
        "924": 42642600,
        "925": 42735000,
        "926": 42827500,
        "927": 42920100,
        "928": 43012800,
        "929": 43105600,
        "930": 43198500,
        "931": 43291500,
        "932": 43384600,
        "933": 43477800,
        "934": 43571100,
        "935": 43664500,
        "936": 43758000,
        "937": 43851600,
        "938": 43945300,
        "939": 44039100,
        "940": 44133000,
        "941": 44227000,
        "942": 44321100,
        "943": 44415300,
        "944": 44509600,
        "945": 44604000,
        "946": 44698500,
        "947": 44793100,
        "948": 44887800,
        "949": 44982600,
        "950": 45077500,
        "951": 45172500,
        "952": 45267600,
        "953": 45362800,
        "954": 45458100,
        "955": 45553500,
        "956": 45649000,
        "957": 45744600,
        "958": 45840300,
        "959": 45936100,
        "960": 46032000,
        "961": 46128000,
        "962": 46224100,
        "963": 46320300,
        "964": 46416600,
        "965": 46513000,
        "966": 46609500,
        "967": 46706100,
        "968": 46802800,
        "969": 46899600,
        "970": 46996500,
        "971": 47093500,
        "972": 47190600,
        "973": 47287800,
        "974": 47385100,
        "975": 47482500,
        "976": 47580000,
        "977": 47677600,
        "978": 47775300,
        "979": 47873100,
        "980": 47971000,
        "981": 48069000,
        "982": 48167100,
        "983": 48265300,
        "984": 48363600,
        "985": 48462000,
        "986": 48560500,
        "987": 48659100,
        "988": 48757800,
        "989": 48856600,
        "990": 48955500,
        "991": 49054500,
        "992": 49153600,
        "993": 49252800,
        "994": 49352100,
        "995": 49451500,
        "996": 49551000,
        "997": 49650600,
        "998": 49750300,
        "999": 49850100,
        "1000": 49950000
    }
}