<div align="center">
  <a href="../README.md">अमेरिकी अंग्रेज़ी</a> |
  <a href="../README.de.md">जर्मन</a> |
  <a href="../README.fr.md">फ़्रेंच</a> |
  <a href="../README.es.md">स्पेनिश</a> |
  <a href="../README.ja.md">जापानी</a> |
  <a href="../README.zh.md">चीनी</a> |
  <a href="../README.pt.md">पुर्तगाली</a> |
  <a href="../README.ko.md">कोरियाई</a> |
  <a href="../README.hi.md">हिन्दी</a>
</div>

<div style="text-align:center; margin:18px 0;">
  <img src="../monitor/api/static/logo.png" alt="MyGPU लोगो"/>
</div>

> *MyGPU: हल्का GPU प्रबंधन उपकरण: एक संक्षिप्त `nvidia-smi` लपेटा हुआ साफ़ वेब डैशबोर्ड के साथ।*

![लाइसेंस](https://img.shields.io/badge/लाइसेंस-MIT-नीला।svg)
![पायथन](https://img.shields.io/badge/पायथन-3.10%2B-नीला)
![संस्करण](https://img.shields.io/badge/संस्करण-1.2.3-नीला)
![प्लेटफ़ॉर्म](https://img.shields.io/badge/प्लेटफ़ॉर्म-विंडोज-ग्रे)
![cuda 12.x](https://img.shields.io/badge/CUDA-12.x-0f9d58?logo=nvidia)

## गैलरी

<details>
  <summary>वेब डैशबोर्ड</summary>
  <div style="display:flex; overflow-x:auto; gap:10px; padding:12px 0; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch;">
    <!-- पहली छवि का उपयोग स्लाइड फ़्रेम के लिए करें; अन्य छवियाँ object-fit:contain का उपयोग करके अंदर फ़िट हो जाएंगी -->
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

- **हल्का**: न्यूनतम संसाधन पदार्थ।
- **लचीला**: CLI उपकरण, पृष्ठभूमि सेवा या पूर्ण-सुविधा वाला वेब डैशबोर्ड के रूप में चलाए जा सकता है।
- **प्रशासक-केंद्रित**: VRAM प्रवर्तन (सीमाओं का स्वचालित रूप से उल्लंघन करने वाली प्रक्रियाओं को समाप्त करना) और निगरानी सूचियाँ शामिल हैं।
- **विकासकर्ता के अनुकूल**: तनाव परीक्षण और 3D कण भौतिकी के लिए निर्मित-इन उपकरण (GEMM, भौतिकी के लिए दृश्य अनुकरण) के साथ मानकीकृत और तनाव परीक्षण।

---

## विशेषताएँ

- **वास्तविक समय निगरानी**:
  - विस्तृत GPU मीट्रिक्स (उपयोग, VRAM, शक्ति, तापमान)।
  - सिस्टम मीट्रिक्स (CPU, RAM, आदि)।

- **प्रशासक और प्रवर्तन**:
  - **VRAM सीमाएँ**: प्रत्येक GPU के लिए VRAM उपयोग पर कठोर सीमाएँ सेट करें।
  - **स्वचालित समाप्ति**: प्रशासक केवल VRAM नीतियों का उल्लंघन करने वाली प्रक्रियाओं को स्वचालित रूप से समाप्त कर सकते हैं (केवल प्रशासक के लिए)।
  - **निगरानी सूचियाँ**: विशिष्ट PID या प्रक्रिया नामों की निगरानी करें।

- **मानकीकरण और तनाव परीक्षण**:
  - **तनाव परीक्षण**: GEMM लोडों के साथ कॉन्फ़िगरेबल GEMM कार्यभारों का परीक्षण करें (थर्मल थ्रॉटलिंग और सिस्टम स्थिरता का परीक्षण करने के लिए)।
  - **3D कण भौतिकी का दृश्य अनुकरण**: GPU लोड का प्रतिनिधित्व करने के लिए इंटरैक्टिव 3D कण भौतिकी अनुकरण।

---

## रोडमैप और भविष्य का काम

योगदान स्वागत हैं! मुख्य भविष्य के बिंदुओं को कवर करने के लिए:

- **बहु-GPU समर्थन**: NVLink टॉपोलॉजी के लिए बेहतर संभालना और बहु-कार्ड सेटअप।
- **कंटेनरीकरण**: आधिकारिक Docker समर्थन के लिए आसान तैनाती कंटेनराइज्ड वातावरण में।
- **दूरस्थ पहुँच**: SSH टनलिंग एकीकरण और सुरक्षित दूरस्थ प्रबंधन।
- **क्रॉस-प्लेटफ़ॉर्म**:
  - [ ] लिनक्स समर्थन (यूबंटू/डेबियन फ़ोकस)।
  - [ ] Apple Silicon पर निगरानी (मॉनिटरिंग)।
- **हार्डवेयर-अग्नेस्ट**:
  - [ ] AMD ROCm समर्थन।
  - [ ] Intel Arc समर्थन।

[CONTRIBUTING.md](../CONTRIBUTING.md) देखें कि कैसे शामिल हों।

---

## आवश्यकताएँ

- **OS**: विंडोज 10/11
- **पायथन**: 3.10+
- **हार्डवेयर**: NVIDIA GPU के साथ स्थापित ड्राइवर।
- **CUDA**: टूलकिट 12.x (बेंचमार्किंग/सिमुलेशन सुविधाओं के लिए आवश्यक)।

---

## स्थापना

उपकरण कई आवश्यकताओं के अनुरूप स्थापित करने के लिए डिज़ाइन किया गया है:

### 1. न्यूनतम (केवल CLI)

सर्वश्रेष्ठ सिर्फ़ हेड-सेर्वर या पृष्ठभूमि निगरानी के लिए।

- कमांड-लाइन इंटरफ़ेस।
- बुनियादी सिस्टम/GPU मीट्रिक्स।

### 2. मानक (CLI + वेब UI)

अधिकांश उपयोगकर्ताओं के लिए सर्वश्रेष्ठ।

- REST API एंडपॉइंट्स।
- वास्तविक समय चार्ट्स।

### 3. पूर्ण (CLI + विज़ुअलाइज़ेशन)

विकास और तनाव परीक्षण के लिए सर्वश्रेष्ठ।

- 3D कण भौतिकी का इंटरैक्टिव अनुकरण।
- PyTorch/CuPy निर्भरताओं के साथ बेंचमार्किंग।

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