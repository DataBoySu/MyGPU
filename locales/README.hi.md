# MyGPU: एक हल्का GPU प्रबंधन उपकरण: एक संक्षिप्त `nvidia-smi` वैकल्पिक साथ एक सुंदर वेब डैशबोर्ड

## गैलरी

<details>
  <summary>वेब डैशबोर्ड</summary>
  <div style="display:flex; overflow-x:auto; gap:10px; padding:12px 0; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch;">
    <!-- पहली छवि का उपयोग स्लाइड फ्रेम के लिए, अन्य छवियां `object-fit: contain` का उपयोग करके अंदर फिट हो जाती हैं -->
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
  </details>

### इसका उपयोग क्यों करें?

- **हल्का**: न्यूनतम संसाधन पैरामीटर।
- **लचीला**: CLI उपकरण के रूप में चलाएं या पूर्ण विशेषताओं वाले वेब डैशबोर्ड के रूप में।
- **प्रशासक-केंद्रित**: VRAM प्रतिबंध (सीमाओं का पालन करने वाली प्रक्रियाओं को स्वचालित रूप से समाप्त करें) और देखने वाली सूचियों सहित विशेषताएं।
- **विकासकर्ता के अनुकूल**: जेएमएम (जेनेरेटिव मैट्रिक्स मल्टीप्लिकेशन) और कण भौतिकी जैसे तनाव परीक्षणों के लिए निर्मित-इन बेंचमार्किंग और दृश्य सिमुलेशन।

---

## विशेषताएं

- **वास्तविक समय की निगरानी**:
  - विस्तृत GPU मेट्रिक्स (उपयोगि, VRAM, शक्ति, तापमान)।
  - सिस्टम मेट्रिक्स (CPU, RAM, आदि)।

- **प्रशासक और प्रवर्तन**:
  - **VRAM सीमाएं**: प्रत्येक GPU के लिए VRAM उपयोग पर कठोर सीमाएं सेट करें।
  - **स्वचालित समाप्ति**: VRAM नीतियों का उल्लंघन करने वाली प्रक्रियाओं को स्वचालित रूप से समाप्त करें (केवल प्रशासक के लिए)।
  - **देखने वाली सूचियाँ**: विशिष्ट PIDs या प्रक्रिया नामों की निगरानी करें।

- **बेंचमार्किंग और सिमुलेशन**:
  - **तनाव परीक्षण**: जेएमएम कार्यों के लिए कॉन्फ़िगरेबल GEMM लोड का उपयोग करके थर्मल थ्रॉटलिंग और स्थिरता का परीक्षण करें।
  - **दृश्य सिमुलेशन**: इंटरैक्टिव 3D कण भौतिकी सिमुलेशन के माध्यम से GPU लोड का दृश्यात्मक प्रदर्शन करें।

---

## रोडमैप और भविष्य का काम

योगदान स्वागत है! मुख्य भविष्य के बिंदुओं को कवर करने के लिए:

- **बहु-GPU समर्थन**: एनवीएलिंक टॉपोलॉजी के लिए उन्नत हैंडलिंग के साथ एनवीडिया कार्ड सेटअप और।
- **कंटेनराइजेशन**: आधिकारिक डॉकर समर्थन के लिए आसान तैनाती एन्वायरनमेंट में।
- **दूरस्थ पहुँच**: SSH टनलिंग एकीकरण और सुरक्षित दूरस्थ प्रबंधन।
- **क्रॉस-प्लेटफ़ॉर्म**:
  - [ ] लिनक्स समर्थन (यूबंटू/डेबियन फ़ोकस)।
  - [ ] ऐपल सिलिकॉन निगरानी के लिए मैकओएस समर्थन।
- **हार्डवेयर अस्पष्टता**:
  - [ ] AMD ROCm समर्थन।
  - [ ] इंटेल आर्क समर्थन।
- **बहु-भाषा दस्तावेज़ीकरण**: GitHub के सबसे लोकप्रिय भाषाओं का समर्थन करना।

[CONTRIBUTING.md](../CONTRIBUTING.md) देखें कि कैसे शामिल हों।

---

## आवश्यकताएँ

- **OS**: विंडोज 10/11
- **पायथन**: 3.10+
- **हार्डवेयर**: एनवीडिया GPU के साथ स्थापित ड्राइवर।
- **CUDA**: टूलकिट 12.x (बेंचमार्किंग/सिमुलेशन सुविधाओं के लिए अनिवार्य)।

---

## स्थापना

उपकरण के लिए कई मॉड्यूलर स्थापना विकल्प उपलब्ध हैं:

### 1. न्यूनतम (केवल CLI)

सर्वर या पृष्ठभूमि निगरानी के लिए सर्वोत्तम, यह CLI केवल विकल्प प्रदान करता है।

- कमांड-लाइन इंटरफ़ेस।
- बुनियादी सिस्टम/GPU मेट्रिक्स।

### 2. मानक (CLI + वेब UI)

अधिकांश उपयोगकर्ताओं के लिए सर्वोत्तम।

- वेब डैशबोर्ड शामिल है।
- REST API एंडपॉइंट्स।
- वास्तविक समय चार्ट।
- लेकिन कोई सिमुलेशन या बेंचमार्किंग नहीं है।

### 3. पूर्ण (मानक + सिमुलेशन)

विकास और तनाव परीक्षण के लिए सर्वोत्तम।

- सिमुलेशन शामिल है।
- बेंचमार्किंग के लिए PyTorch/CuPy निर्भरताएँ।

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