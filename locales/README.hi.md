# MyGPU: एक हल्का GPU प्रबंधन उपकरण

*MyGPU: एक संक्षिप्त `nvidia-smi` वैरिएंट के साथ एक सुंदर वेब डैशबोर्ड वाला GPU प्रबंधन उपकरण।*

![लाइसेंस](https://img.shields.io/badge/लाइसेंस-MIT-blue.svg)
![पायथन](https://img.shields.io/badge/पायथन-3.10%2B-blue)
![संस्करण](https://img.shields.io/badge/संस्करण-1.2.3-blue)
![प्लेटफ़ॉर्म](https://img.shields.io/badge/प्लेटफ़ॉर्म-Windows-lightgrey)
![cuda 12.x](https://img.shields.io/badge/CUDA-12.x-0f9d58?logo=nvidia)

## गैलरी

<details>

  <summary>
  वेब डैशबोर्ड
  </summary>

  <div style="display:flex; overflow-x:auto; gap:10px; padding:12px 0; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch;">
    <!-- पहली छवि का उपयोग सभी छवियों के लिए फ्रेम के रूप में करें; छवियां `object-fit: contain` का उपयोग करके अंदर फिट हो जाएंगी -->
    <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/web1.png" style="width:100%; height:100%; object-fit:contain;" />
    </div>
    <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/web2.png" style="width:100%; height:100%; object-fit:contain;" />
    </div>
    <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/web3.png" style="width:100%; height:100%; object-fit:contain;" />
    </div>
    <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/web4.png" style="width:100%; height:100%; object-fit:contain;" />
    </div>
  </div>

</details>
<details>
  <summary>CLI</summary>
  <div style="display:flex; overflow-x:auto; gap:10px; padding:12px 0; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch;">
    <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/cli1.png" style="width:100%; height:100%; object-fit:contain;" />
    </div>
    <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/cli2.png" style="width:100%; height:100%; object-fit:contain;" />
    </div>
    <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/cli3.png" style="width:100%; height:100%; object-fit:contain;" />
    </div>
    <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/cli4.png" style="width:100%; height:100%; object-fit:contain;" />
    </div>
    <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/cli5.png" style="width:100%; height:100%; object-fit:contain;" />
    </div>
  </div>
</details>

### इसका उपयोग क्यों करें?

- **हल्का**: न्यूनतम संसाधन पैरामीटर।
- **लचीला**: CLI उपकरण के रूप में या पूर्ण वेब डैशबोर्ड के रूप में उपयोग करें।
- **प्रशासक-केंद्रित**: **VRAM प्रवर्तन** (सीमाओं का उल्लंघन करने वाली प्रक्रियाओं को स्वचालित रूप से समाप्त करना) और **निगरानी सूचियाँ** शामिल हैं।
- **विकासकर्ता अनुकूल**: तनाव परीक्षण और सिमुलेशन के लिए निर्मित-इन उपकरण (GEMM, कण भौतिकी)।

---

## विशेषताएँ

- **वास्तविक समय निगरानी**:
  - विस्तृत GPU मीट्रिक्स (उपयोगि, VRAM, शक्ति, तापमान)।
  - सिस्टम मीट्रिक्स (CPU, RAM, आदि)।

- **प्रशासक और प्रवर्तन**:
  - **VRAM सीमाएँ**: प्रत्येक GPU के लिए VRAM उपयोग पर कठोर सीमाएँ सेट करें।
  - **स्वचालित समापन**: प्रशासक केवल VRAM नीतियों का उल्लंघन करने वाली प्रक्रियाओं को स्वचालित रूप से समाप्त करें (केवल प्रशासक के लिए)।
  - **निगरानी सूचियाँ**: विशिष्ट PID या प्रक्रिया नामों की निगरानी करें।

- **बेंचमार्किंग और सिमुलेशन**:
  - **तनाव परीक्षण**: जेएमएम लोड के साथ कॉन्फ़िगरेबल जेएमएम वर्कलोड का उपयोग करके थर्मल थ्रॉटलिंग और स्थिरता का परीक्षण करें।
  - **कण भौतिकी सिमुलेशन**: GPU लोड को दृश्य बनाने के लिए इंटरैक्टिव 3D कण भौतिकी सिमुलेशन का उपयोग करें।

---

## रोडमैप और भविष्य का काम

योगदान स्वागत है! मुख्य भविष्य के बिंदुओं को कवर करने के लिए:

- **मल्टी-GPU समर्थन**: एनवीएलिंक टॉपोलॉजी के लिए बेहतर हैंडलिंग के साथ एनवीडिया कार्ड सेटअप और संयोजन के लिए बढ़िया।
- **कंटेनराइजेशन**: आधिकारिक डॉकर समर्थन के लिए सेटअप, आसान तैनाती के लिए कंटेनराइज्ड वातावरण में संचालित।
- **दूरस्थ पहुँच**: SSH टनलिंग एकीकरण और सुरक्षित दूरस्थ प्रबंधन।
- **क्रॉस-प्लेटफ़ॉर्म**:
  - [ ] लिनक्स समर्थन (यूबंटू/डेबियन फोकस)।
  - [ ] ऐपल सिलिकॉन निगरानी के लिए मैकओएस समर्थन।
- **हार्डवेयर अस्तित्व**:
  - [ ] AMD ROCm समर्थन।
  - [ ] इंटेल आर्क समर्थन।
- ~~**बहु-भाषा दस्तावेज़ीकरण**: सबसे लोकप्रिय GitHub भाषाओं का समर्थन।~~

[CONTRIBUTING.md](../CONTRIBUTING.md) देखें कि कैसे शामिल हों।

---

## आवश्यकताएँ

- **OS**: विंडोज 10/11
- **पायथन**: 3.10+
- **हार्डवेयर**: एनवीडिया GPU के साथ स्थापित ड्राइवर।
- **CUDA**: टूलकिट 12.x (बेंचमार्किंग/सिमुलेशन सुविधाओं के लिए सख्त रूप से आवश्यक)।

---

## स्थापना

उपकरण के लिए कई स्थापना विकल्प उपलब्ध हैं:

### 1. न्यूनतम (केवल CLI)

सर्वर या पृष्ठभूमि निगरानी के लिए सबसे अच्छा, सरल सिस्टम/GPU मीट्रिक्स।

### 2. मानक (CLI + वेब UI)

अधिकांश उपयोगकर्ताओं के लिए सबसे अच्छा, वास्तविक समय चार्ट और REST API अंकों के साथ वेब डैशबोर्ड।

### 3. पूर्ण (मानक + विज़ुअलाइज़ेशन)

विकास और तनाव परीक्षण के लिए सबसे अच्छा, पायथन/CuPy निर्भरताओं के साथ बेंचमार्किंग।

### त्वरित शुरुआत

1. **डाउनलोड** नवीनतम रिलीज़ या रिपॉजिटरी क्लोन करें।
2. **सेटअप चलाएँ**:

  ```powershell
  .\setup.ps1
  ```

3. **लॉन्च**:

```powershell
# वेब डैशबोर्ड शुरू करें (मानक/पूर्ण)
python health_monitor.py web

# CLI शुरू करें
python health_monitor.py cli
```

---

## लाइसेंस

MIT लाइसेंस। [LICENSE](../LICENSE) देखें विवरण के लिए।