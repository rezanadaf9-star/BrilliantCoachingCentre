/* =========================================================
   DIGITAL CLASSROOM — QUIZZES JAVASCRIPT

   Backend-ready quiz system.

   SCHEDULE:
   Weekly, Monthly and Chapter-wise quizzes are controlled
   only by the admin's startAt / endAt time. There is NO
   Sunday or 1st-day restriction.

   DEMO:
   Keep useBackend false and uncomment a quiz inside
   demoQuizData when you want to test locally.

   BACKEND:
   Set useBackend true and provide backendEndpoint.

   Requests:
   /api/quizzes?type=weekly&date=YYYY-MM-DD
   /api/quizzes?type=monthly&date=YYYY-MM-DD
   /api/quizzes?type=chapter&subject=maths&date=YYYY-MM-DD
   ========================================================= */

(function () {
  "use strict";

  const quizConfig = {
    backendEndpoint: "",
    historyEndpoint: "",
    submitEndpoint: "",
    useBackend: false
  };

  const quizHistoryStorageKey = "bccQuizAttempts";

  const subjects = [
    { id: "social-sciences", name: "Social Sciences", icon: "fa-landmark" },
    { id: "science", name: "Science", icon: "fa-flask" },
    { id: "maths", name: "Maths", icon: "fa-calculator" },
    { id: "hindi", name: "Hindi", icon: "fa-language" },
    { id: "english", name: "English", icon: "fa-pen-nib" },
    { id: "urdu", name: "Urdu", icon: "fa-book-quran" }
  ];

  /* =====================================================
     DEMO QUIZZES
     -----------------------------------------------------
     These examples are intentionally commented out.
     Uncomment an object to test it locally.

     IMPORTANT:
     startAt and endAt can be ANY date and time.
     There is no weekly/monthly day restriction.

     answer: 0 = A, 1 = B, 2 = C, 3 = D
     ===================================================== */

  const demoQuizData = [
    {
      id: "weekly-demo-001",
      type: "weekly",
      title: "Weekly GK Quiz",
      startAt: "2026-10-09T09:00:00+05:30",
      endAt: "2026-11-01T10:00:00+05:30",
      durationMinutes: 20,
      marksPerQuestion: 1,
      negativeMarks: 0.25,
      questions: [
        {
          id: "q1",
          question:
            "Which Delhi Sultanate ruler commissioned the construction of the magnificent Alai Darwaza, the southern gateway of the Quwwat-ul-Islam Mosque in the Qutb complex?",
          options: [
            "Qutb-ud-din Aibak",
            "Iltutmish",
            "Alauddin Khilji",
            "Firoz Shah Tughlaq",
          ],
          answer: 2,
        },
        {
          id: "q2",
          question:
            "The Islamic calendar (Hijri calendar) begins its chronological counting from which major historical event?",
          options: [
            "The migration (Hijrah) of the Prophet from Mecca to Medina",
            "The birth of Prophet MuhammadIncorrect.",
            "The revelation of the first Quranic verse",
            "The Conquest of Mecca",
          ],
          answer: 0,
        },
        {
          id: "q3",
          question:
            "With which neighboring country does India share its longest international land border?",
          options: ["China", "Pakistan", "Nepal", "Bangladesh"],
          answer: 3,
        },
        {
          id: "q4",
          question:
            "Which iconic Mughal monument in Agra is renowned for its symmetrical white marble structure, intricate pietra dura inlay work, and classical charbagh garden layout?",
          options: [
            "Humayun's Tomb",
            "Taj Mahal",
            "Jama Masjid",
            "Red Fort of Delhi",
          ],
          answer: 1,
        },
        {
          id: "q5",
          question:
            "What is the term for the mandatory practice of giving a fixed percentage of one's accumulated wealth to charity, constituting one of the Five Pillars of Islam?",
          options: ["Zakat", "Salat", "Hajj"],
          answer: 0,
        },
      ],
    },









    {
      id: "weekly-demo-005",
      type: "weekly",
      title: "Weekly Science Quiz Class 10",
      startAt: "2026-09-17T09:00:00+05:30",
      endAt: "2026-10-28T10:00:00+05:30",
      durationMinutes: 25,
      marksPerQuestion: 1,
      negativeMarks: 0.25,
      questions: [
        {
          id: "science-001",
          question: "कोशिका का पावरहाउस किस कोशिकांग को कहा जाता है?",
          options: [
            "केंद्रक",
            "राइबोसोम",
            "माइटोकॉन्ड्रिया",
            "गॉल्जी तंत्र"
          ],
          question_en: "Which organelle is known as the powerhouse of the cell?",
          options_en: [
            "Nucleus",
            "Ribosome",
            "Mitochondria",
            "Golgi Apparatus"
          ],
          answer: 2,
          explanation: "Mitochondria produce ATP, which provides usable energy for many cellular activities."
        },

        {
          id: "science-002",
          question: "बल की SI इकाई क्या है?",
          options: [
            "जूल",
            "न्यूटन",
            "वाट",
            "पास्कल"
          ],
          question_en: "What is the SI unit of force?",
          options_en: [
            "Joule",
            "Newton",
            "Watt",
            "Pascal"
          ],
          answer: 1,
          explanation: "The SI unit of force is Newton (N)."
        },

        {
          id: "science-003",
          question: "जल का रासायनिक सूत्र क्या है?",
          options: [
            "कार्बन डाइऑक्साइड",
            "ऑक्सीजन",
            "H₂O",
            "हाइड्रोजन"
          ],
          question_en: "What is the chemical formula of water?",
          options_en: [
            "CO₂",
            "O₂",
            "H₂O",
            "H₂"
          ],
          answer: 2,
          explanation: "One water molecule contains two hydrogen atoms and one oxygen atom."
        },

        {
          id: "science-004",
          question: "प्रकाश संश्लेषण के दौरान पौधे मुख्य रूप से किस गैस का उपयोग करते हैं?",
          options: [
            "ऑक्सीजन",
            "नाइट्रोजन",
            "कार्बन डाइऑक्साइड",
            "हाइड्रोजन"
          ],
          question_en: "Which gas is mainly used by plants during photosynthesis?",
          options_en: [
            "Oxygen",
            "Nitrogen",
            "Carbon dioxide",
            "Hydrogen"
          ],
          answer: 2,
          explanation: "Plants use carbon dioxide, water and sunlight to make food through photosynthesis."
        },

        {
          id: "science-005",
          question: "कौन-सी रक्त कोशिकाएँ संक्रमण से लड़ने में मदद करती हैं?",
          options: [
            "लाल रक्त कोशिकाएँ",
            "श्वेत रक्त कोशिकाएँ",
            "प्लेटलेट्स",
            "प्लाज्मा"
          ],
          question_en: "Which blood cells help fight infections?",
          options_en: [
            "Red Blood Cells",
            "White Blood Cells",
            "Platelets",
            "Plasma"
          ],
          answer: 1,
          explanation: "White blood cells are an important part of the body's immune system."
        },

        {
          id: "science-006",
          question: "पृथ्वी पर गुरुत्वीय त्वरण का लगभग मान कितना है?",
          options: [
            "4.9 मीटर/सेकंड²",
            "9.8 मीटर/सेकंड²",
            "19.6 मीटर/सेकंड²",
            "98 मीटर/सेकंड²"
          ],
          question_en: "What is the approximate acceleration due to gravity on Earth?",
          options_en: [
            "4.9 m/s²",
            "9.8 m/s²",
            "19.6 m/s²",
            "98 m/s²"
          ],
          answer: 1,
          explanation: "The acceleration due to gravity near Earth's surface is approximately 9.8 m/s²."
        },

        {
          id: "science-007",
          question: "पौधे का कौन-सा भाग मिट्टी से अधिकांश जल और खनिजों को अवशोषित करता है?",
          options: [
            "तना",
            "पत्ती",
            "जड़ के रोम",
            "फूल"
          ],
          question_en: "Which part of a plant absorbs most water and minerals from the soil?",
          options_en: [
            "Stem",
            "Leaf",
            "Root hairs",
            "Flower"
          ],
          answer: 2,
          explanation: "Root hairs increase the surface area available for absorbing water and minerals."
        },

        {
          id: "science-008",
          question: "सूर्य के प्रकाश के संपर्क में आने पर त्वचा में मुख्य रूप से कौन-सा विटामिन बनता है?",
          options: [
            "विटामिन A",
            "विटामिन B",
            "विटामिन C",
            "विटामिन D"
          ],
          question_en: "Which vitamin is mainly produced in the skin through sunlight exposure?",
          options_en: [
            "Vitamin A",
            "Vitamin B",
            "Vitamin C",
            "Vitamin D"
          ],
          answer: 3,
          explanation: "UVB radiation from sunlight helps the skin produce vitamin D."
        },

        {
          id: "science-009",
          question: "अधिकांश जीवों में आनुवंशिक जानकारी कौन-सा अणु वहन करता है?",
          options: [
            "ATP",
            "DNA",
            "ग्लूकोज़",
            "प्रोटीन"
          ],
          question_en: "Which molecule carries genetic information in most living organisms?",
          options_en: [
            "ATP",
            "DNA",
            "Glucose",
            "Protein"
          ],
          answer: 1,
          explanation: "DNA stores genetic instructions used by living organisms."
        },

        {
          id: "science-010",
          question: "25°C पर एक उदासीन विलयन का pH कितना होता है?",
          options: [
            "0",
            "5",
            "7",
            "14"
          ],
          question_en: "What is the pH of a neutral solution at 25°C?",
          options_en: [
            "0",
            "5",
            "7",
            "14"
          ],
          answer: 2,
          explanation: "At 25°C, a neutral aqueous solution has a pH of approximately 7."
        },

        {
          id: "science-011",
          question: "कौन-सा नियम कहता है कि प्रत्येक क्रिया की बराबर और विपरीत प्रतिक्रिया होती है?",
          options: [
            "न्यूटन का प्रथम नियम",
            "न्यूटन का द्वितीय नियम",
            "न्यूटन का तृतीय नियम",
            "गुरुत्वाकर्षण का नियम"
          ],
          question_en: "Which law states that every action has an equal and opposite reaction?",
          options_en: [
            "Newton's First Law",
            "Newton's Second Law",
            "Newton's Third Law",
            "Law of Gravitation"
          ],
          answer: 2,
          explanation: "Newton's third law describes action and reaction force pairs."
        },

        {
          id: "science-012",
          question: "कौन-सी संरचना यह नियंत्रित करती है कि कोशिका के अंदर क्या प्रवेश करे और बाहर क्या जाए?",
          options: [
            "कोशिका भित्ति",
            "कोशिका झिल्ली",
            "केंद्रक",
            "कोशिकाद्रव्य"
          ],
          question_en: "Which structure controls what enters and leaves a cell?",
          options_en: [
            "Cell wall",
            "Cell membrane",
            "Nucleus",
            "Cytoplasm"
          ],
          answer: 1,
          explanation: "The cell membrane regulates the movement of substances into and out of the cell."
        },

        {
          id: "science-013",
          question: "हमारे सौरमंडल का सबसे बड़ा ग्रह कौन-सा है?",
          options: [
            "पृथ्वी",
            "शनि",
            "बृहस्पति",
            "वरुण"
          ],
          question_en: "Which is the largest planet in our Solar System?",
          options_en: [
            "Earth",
            "Saturn",
            "Jupiter",
            "Neptune"
          ],
          answer: 2,
          explanation: "Jupiter is the largest planet in the Solar System."
        },

        {
          id: "science-014",
          question: "मानव शरीर का सबसे बड़ा अंग कौन-सा है?",
          options: [
            "हृदय",
            "यकृत",
            "त्वचा",
            "मस्तिष्क"
          ],
          question_en: "Which is the largest organ of the human body?",
          options_en: [
            "Heart",
            "Liver",
            "Skin",
            "Brain"
          ],
          answer: 2,
          explanation: "The skin is the body's largest organ and forms a protective barrier."
        },

        {
          id: "science-015",
          question: "निर्वात में प्रकाश की लगभग गति कितनी होती है?",
          options: [
            "3 × 10⁶ मीटर/सेकंड",
            "3 × 10⁷ मीटर/सेकंड",
            "3 × 10⁸ मीटर/सेकंड",
            "3 × 10⁹ मीटर/सेकंड"
          ],
          question_en: "What is the approximate speed of light in vacuum?",
          options_en: [
            "3 × 10⁶ m/s",
            "3 × 10⁷ m/s",
            "3 × 10⁸ m/s",
            "3 × 10⁹ m/s"
          ],
          answer: 2,
          explanation: "Light travels through vacuum at approximately 3 × 10⁸ metres per second."
        },

        {
          id: "science-016",
          question: "मानव मस्तिष्क का कौन-सा भाग संतुलन और समन्वय को नियंत्रित करता है?",
          options: [
            "प्रमस्तिष्क",
            "अनुमस्तिष्क",
            "मेडुला",
            "हाइपोथैलेमस"
          ],
          question_en: "Which part of the human brain controls balance and coordination?",
          options_en: [
            "Cerebrum",
            "Cerebellum",
            "Medulla",
            "Hypothalamus"
          ],
          answer: 1,
          explanation: "The cerebellum plays an important role in balance, posture and coordination of movements."
        },

        // NEW SCIENCE QUESTIONS

        {
          id: "science-017",
          question: "मनुष्य के शरीर में रक्त को पंप करने वाला अंग कौन-सा है?",
          options: [
            "फेफड़े",
            "हृदय",
            "गुर्दे",
            "यकृत"
          ],
          question_en: "Which organ pumps blood throughout the human body?",
          options_en: [
            "Lungs",
            "Heart",
            "Kidneys",
            "Liver"
          ],
          answer: 1,
          explanation: "The heart pumps blood throughout the body."
        },

        {
          id: "science-018",
          question: "पौधों में भोजन का परिवहन किस ऊतक द्वारा होता है?",
          options: [
            "जाइलम",
            "फ्लोएम",
            "मेरिस्टेम",
            "एपिडर्मिस"
          ],
          question_en: "Which tissue transports food in plants?",
          options_en: [
            "Xylem",
            "Phloem",
            "Meristem",
            "Epidermis"
          ],
          answer: 1,
          explanation: "Phloem transports food produced by leaves to different parts of the plant."
        },

        {
          id: "science-019",
          question: "ध्वनि किस माध्यम में सबसे तेज गति से यात्रा करती है?",
          options: [
            "वायु",
            "जल",
            "ठोस",
            "निर्वात"
          ],
          question_en: "In which medium does sound travel fastest?",
          options_en: [
            "Air",
            "Water",
            "Solids",
            "Vacuum"
          ],
          answer: 2,
          explanation: "Sound generally travels fastest through solids because their particles are closely packed."
        },

        {
          id: "science-020",
          question: "मानव शरीर में ऑक्सीजन का परिवहन मुख्य रूप से किसके द्वारा होता है?",
          options: [
            "प्लाज्मा",
            "हीमोग्लोबिन",
            "प्लेटलेट्स",
            "श्वेत रक्त कोशिकाएँ"
          ],
          question_en: "What mainly transports oxygen in the human body?",
          options_en: [
            "Plasma",
            "Hemoglobin",
            "Platelets",
            "White blood cells"
          ],
          answer: 1,
          explanation: "Hemoglobin in red blood cells binds with oxygen and helps transport it through the body."
        },

        {
          id: "science-021",
          question: "पानी का क्वथनांक सामान्य वायुमंडलीय दाब पर कितना होता है?",
          options: [
            "0°C",
            "50°C",
            "100°C",
            "200°C"
          ],
          question_en: "What is the boiling point of water at normal atmospheric pressure?",
          options_en: [
            "0°C",
            "50°C",
            "100°C",
            "200°C"
          ],
          answer: 2,
          explanation: "Water boils at 100°C at standard atmospheric pressure."
        },

        {
          id: "science-022",
          question: "किस गैस की कमी से पौधों में प्रकाश संश्लेषण की दर कम हो सकती है?",
          options: [
            "ऑक्सीजन",
            "कार्बन डाइऑक्साइड",
            "नाइट्रोजन",
            "हीलियम"
          ],
          question_en: "A shortage of which gas can reduce the rate of photosynthesis in plants?",
          options_en: [
            "Oxygen",
            "Carbon dioxide",
            "Nitrogen",
            "Helium"
          ],
          answer: 1,
          explanation: "Carbon dioxide is a raw material required for photosynthesis."
        },

        {
          id: "science-023",
          question: "विद्युत धारा को मापने के लिए किस यंत्र का उपयोग किया जाता है?",
          options: [
            "वोल्टमीटर",
            "अमीटर",
            "बैरोमीटर",
            "थर्मामीटर"
          ],
          question_en: "Which instrument is used to measure electric current?",
          options_en: [
            "Voltmeter",
            "Ammeter",
            "Barometer",
            "Thermometer"
          ],
          answer: 1,
          explanation: "An ammeter is used to measure electric current in a circuit."
        },

        {
          id: "science-024",
          question: "अम्ल का स्वाद सामान्यतः कैसा होता है?",
          options: [
            "मीठा",
            "कड़वा",
            "खट्टा",
            "नमकीन"
          ],
          question_en: "What does an acid generally taste like?",
          options_en: [
            "Sweet",
            "Bitter",
            "Sour",
            "Salty"
          ],
          answer: 2,
          explanation: "Acids generally have a sour taste, although chemicals should never be tasted in practice."
        },

        {
          id: "science-025",
          question: "सूर्य से पृथ्वी तक ऊर्जा मुख्य रूप से किस रूप में पहुँचती है?",
          options: [
            "ध्वनि तरंगों के रूप में",
            "विद्युतचुंबकीय विकिरण के रूप में",
            "जल तरंगों के रूप में",
            "यांत्रिक तरंगों के रूप में"
          ],
          question_en: "In what form does energy from the Sun mainly reach Earth?",
          options_en: [
            "As sound waves",
            "As electromagnetic radiation",
            "As water waves",
            "As mechanical waves"
          ],
          answer: 1,
          explanation: "Energy from the Sun reaches Earth mainly through electromagnetic radiation, including visible light and infrared radiation."
        }
      ]
    },


    {
      id: "weekly-demo-006",
      type: "weekly",
      title: "Weekly Science Quiz Class 10",
      startAt: "2026-10-09T09:00:00+05:30",
      endAt: "2026-11-28T10:00:00+05:30",
      durationMinutes: 25,
      marksPerQuestion: 1,
      negativeMarks: 0,
      questions: [
        {
          id: "science-001",
          question: "कोशिका का पावरहाउस किस कोशिकांग को कहा जाता है?",
          options: [
            "केंद्रक",
            "राइबोसोम",
            "माइटोकॉन्ड्रिया",
            "गॉल्जी तंत्र"
          ],
          question_en: "Which organelle is known as the powerhouse of the cell?",
          options_en: [
            "Nucleus",
            "Ribosome",
            "Mitochondria",
            "Golgi Apparatus"
          ],
          answer: 2,
          explanation: "Mitochondria produce ATP, which provides usable energy for many cellular activities."
        },

        {
          id: "science-002",
          question: "बल की SI इकाई क्या है?",
          options: [
            "जूल",
            "न्यूटन",
            "वाट",
            "पास्कल"
          ],
          question_en: "What is the SI unit of force?",
          options_en: [
            "Joule",
            "Newton",
            "Watt",
            "Pascal"
          ],
          answer: 1,
          explanation: "The SI unit of force is Newton (N)."
        },

        {
          id: "science-003",
          question: "जल का रासायनिक सूत्र क्या है?",
          options: [
            "कार्बन डाइऑक्साइड",
            "ऑक्सीजन",
            "H₂O",
            "हाइड्रोजन"
          ],
          question_en: "What is the chemical formula of water?",
          options_en: [
            "CO₂",
            "O₂",
            "H₂O",
            "H₂"
          ],
          answer: 2,
          explanation: "One water molecule contains two hydrogen atoms and one oxygen atom."
        },

        {
          id: "science-004",
          question: "प्रकाश संश्लेषण के दौरान पौधे मुख्य रूप से किस गैस का उपयोग करते हैं?",
          options: [
            "ऑक्सीजन",
            "नाइट्रोजन",
            "कार्बन डाइऑक्साइड",
            "हाइड्रोजन"
          ],
          question_en: "Which gas is mainly used by plants during photosynthesis?",
          options_en: [
            "Oxygen",
            "Nitrogen",
            "Carbon dioxide",
            "Hydrogen"
          ],
          answer: 2,
          explanation: "Plants use carbon dioxide, water and sunlight to make food through photosynthesis."
        },

        {
          id: "science-005",
          question: "कौन-सी रक्त कोशिकाएँ संक्रमण से लड़ने में मदद करती हैं?",
          options: [
            "लाल रक्त कोशिकाएँ",
            "श्वेत रक्त कोशिकाएँ",
            "प्लेटलेट्स",
            "प्लाज्मा"
          ],
          question_en: "Which blood cells help fight infections?",
          options_en: [
            "Red Blood Cells",
            "White Blood Cells",
            "Platelets",
            "Plasma"
          ],
          answer: 1,
          explanation: "White blood cells are an important part of the body's immune system."
        },

        {
          id: "science-006",
          question: "पृथ्वी पर गुरुत्वीय त्वरण का लगभग मान कितना है?",
          options: [
            "4.9 मीटर/सेकंड²",
            "9.8 मीटर/सेकंड²",
            "19.6 मीटर/सेकंड²",
            "98 मीटर/सेकंड²"
          ],
          question_en: "What is the approximate acceleration due to gravity on Earth?",
          options_en: [
            "4.9 m/s²",
            "9.8 m/s²",
            "19.6 m/s²",
            "98 m/s²"
          ],
          answer: 1,
          explanation: "The acceleration due to gravity near Earth's surface is approximately 9.8 m/s²."
        },

        {
          id: "science-007",
          question: "पौधे का कौन-सा भाग मिट्टी से अधिकांश जल और खनिजों को अवशोषित करता है?",
          options: [
            "तना",
            "पत्ती",
            "जड़ के रोम",
            "फूल"
          ],
          question_en: "Which part of a plant absorbs most water and minerals from the soil?",
          options_en: [
            "Stem",
            "Leaf",
            "Root hairs",
            "Flower"
          ],
          answer: 2,
          explanation: "Root hairs increase the surface area available for absorbing water and minerals."
        },

        {
          id: "science-008",
          question: "सूर्य के प्रकाश के संपर्क में आने पर त्वचा में मुख्य रूप से कौन-सा विटामिन बनता है?",
          options: [
            "विटामिन A",
            "विटामिन B",
            "विटामिन C",
            "विटामिन D"
          ],
          question_en: "Which vitamin is mainly produced in the skin through sunlight exposure?",
          options_en: [
            "Vitamin A",
            "Vitamin B",
            "Vitamin C",
            "Vitamin D"
          ],
          answer: 3,
          explanation: "UVB radiation from sunlight helps the skin produce vitamin D."
        },

        {
          id: "science-009",
          question: "अधिकांश जीवों में आनुवंशिक जानकारी कौन-सा अणु वहन करता है?",
          options: [
            "ATP",
            "DNA",
            "ग्लूकोज़",
            "प्रोटीन"
          ],
          question_en: "Which molecule carries genetic information in most living organisms?",
          options_en: [
            "ATP",
            "DNA",
            "Glucose",
            "Protein"
          ],
          answer: 1,
          explanation: "DNA stores genetic instructions used by living organisms."
        },

        {
          id: "science-010",
          question: "25°C पर एक उदासीन विलयन का pH कितना होता है?",
          options: [
            "0",
            "5",
            "7",
            "14"
          ],
          question_en: "What is the pH of a neutral solution at 25°C?",
          options_en: [
            "0",
            "5",
            "7",
            "14"
          ],
          answer: 2,
          explanation: "At 25°C, a neutral aqueous solution has a pH of approximately 7."
        },

        {
          id: "science-011",
          question: "कौन-सा नियम कहता है कि प्रत्येक क्रिया की बराबर और विपरीत प्रतिक्रिया होती है?",
          options: [
            "न्यूटन का प्रथम नियम",
            "न्यूटन का द्वितीय नियम",
            "न्यूटन का तृतीय नियम",
            "गुरुत्वाकर्षण का नियम"
          ],
          question_en: "Which law states that every action has an equal and opposite reaction?",
          options_en: [
            "Newton's First Law",
            "Newton's Second Law",
            "Newton's Third Law",
            "Law of Gravitation"
          ],
          answer: 2,
          explanation: "Newton's third law describes action and reaction force pairs."
        },

        {
          id: "science-012",
          question: "कौन-सी संरचना यह नियंत्रित करती है कि कोशिका के अंदर क्या प्रवेश करे और बाहर क्या जाए?",
          options: [
            "कोशिका भित्ति",
            "कोशिका झिल्ली",
            "केंद्रक",
            "कोशिकाद्रव्य"
          ],
          question_en: "Which structure controls what enters and leaves a cell?",
          options_en: [
            "Cell wall",
            "Cell membrane",
            "Nucleus",
            "Cytoplasm"
          ],
          answer: 1,
          explanation: "The cell membrane regulates the movement of substances into and out of the cell."
        },

        {
          id: "science-013",
          question: "हमारे सौरमंडल का सबसे बड़ा ग्रह कौन-सा है?",
          options: [
            "पृथ्वी",
            "शनि",
            "बृहस्पति",
            "वरुण"
          ],
          question_en: "Which is the largest planet in our Solar System?",
          options_en: [
            "Earth",
            "Saturn",
            "Jupiter",
            "Neptune"
          ],
          answer: 2,
          explanation: "Jupiter is the largest planet in the Solar System."
        },

        {
          id: "science-014",
          question: "मानव शरीर का सबसे बड़ा अंग कौन-सा है?",
          options: [
            "हृदय",
            "यकृत",
            "त्वचा",
            "मस्तिष्क"
          ],
          question_en: "Which is the largest organ of the human body?",
          options_en: [
            "Heart",
            "Liver",
            "Skin",
            "Brain"
          ],
          answer: 2,
          explanation: "The skin is the body's largest organ and forms a protective barrier."
        },

        {
          id: "science-015",
          question: "निर्वात में प्रकाश की लगभग गति कितनी होती है?",
          options: [
            "3 × 10⁶ मीटर/सेकंड",
            "3 × 10⁷ मीटर/सेकंड",
            "3 × 10⁸ मीटर/सेकंड",
            "3 × 10⁹ मीटर/सेकंड"
          ],
          question_en: "What is the approximate speed of light in vacuum?",
          options_en: [
            "3 × 10⁶ m/s",
            "3 × 10⁷ m/s",
            "3 × 10⁸ m/s",
            "3 × 10⁹ m/s"
          ],
          answer: 2,
          explanation: "Light travels through vacuum at approximately 3 × 10⁸ metres per second."
        },

        {
          id: "science-016",
          question: "मानव मस्तिष्क का कौन-सा भाग संतुलन और समन्वय को नियंत्रित करता है?",
          options: [
            "प्रमस्तिष्क",
            "अनुमस्तिष्क",
            "मेडुला",
            "हाइपोथैलेमस"
          ],
          question_en: "Which part of the human brain controls balance and coordination?",
          options_en: [
            "Cerebrum",
            "Cerebellum",
            "Medulla",
            "Hypothalamus"
          ],
          answer: 1,
          explanation: "The cerebellum plays an important role in balance, posture and coordination of movements."
        },

        // NEW SCIENCE QUESTIONS

        {
          id: "science-017",
          question: "मनुष्य के शरीर में रक्त को पंप करने वाला अंग कौन-सा है?",
          options: [
            "फेफड़े",
            "हृदय",
            "गुर्दे",
            "यकृत"
          ],
          question_en: "Which organ pumps blood throughout the human body?",
          options_en: [
            "Lungs",
            "Heart",
            "Kidneys",
            "Liver"
          ],
          answer: 1,
          explanation: "The heart pumps blood throughout the body."
        },

        {
          id: "science-018",
          question: "पौधों में भोजन का परिवहन किस ऊतक द्वारा होता है?",
          options: [
            "जाइलम",
            "फ्लोएम",
            "मेरिस्टेम",
            "एपिडर्मिस"
          ],
          question_en: "Which tissue transports food in plants?",
          options_en: [
            "Xylem",
            "Phloem",
            "Meristem",
            "Epidermis"
          ],
          answer: 1,
          explanation: "Phloem transports food produced by leaves to different parts of the plant."
        },

        {
          id: "science-019",
          question: "ध्वनि किस माध्यम में सबसे तेज गति से यात्रा करती है?",
          options: [
            "वायु",
            "जल",
            "ठोस",
            "निर्वात"
          ],
          question_en: "In which medium does sound travel fastest?",
          options_en: [
            "Air",
            "Water",
            "Solids",
            "Vacuum"
          ],
          answer: 2,
          explanation: "Sound generally travels fastest through solids because their particles are closely packed."
        },

        {
          id: "science-020",
          question: "मानव शरीर में ऑक्सीजन का परिवहन मुख्य रूप से किसके द्वारा होता है?",
          options: [
            "प्लाज्मा",
            "हीमोग्लोबिन",
            "प्लेटलेट्स",
            "श्वेत रक्त कोशिकाएँ"
          ],
          question_en: "What mainly transports oxygen in the human body?",
          options_en: [
            "Plasma",
            "Hemoglobin",
            "Platelets",
            "White blood cells"
          ],
          answer: 1,
          explanation: "Hemoglobin in red blood cells binds with oxygen and helps transport it through the body."
        },

        {
          id: "science-021",
          question: "पानी का क्वथनांक सामान्य वायुमंडलीय दाब पर कितना होता है?",
          options: [
            "0°C",
            "50°C",
            "100°C",
            "200°C"
          ],
          question_en: "What is the boiling point of water at normal atmospheric pressure?",
          options_en: [
            "0°C",
            "50°C",
            "100°C",
            "200°C"
          ],
          answer: 2,
          explanation: "Water boils at 100°C at standard atmospheric pressure."
        },

        {
          id: "science-022",
          question: "किस गैस की कमी से पौधों में प्रकाश संश्लेषण की दर कम हो सकती है?",
          options: [
            "ऑक्सीजन",
            "कार्बन डाइऑक्साइड",
            "नाइट्रोजन",
            "हीलियम"
          ],
          question_en: "A shortage of which gas can reduce the rate of photosynthesis in plants?",
          options_en: [
            "Oxygen",
            "Carbon dioxide",
            "Nitrogen",
            "Helium"
          ],
          answer: 1,
          explanation: "Carbon dioxide is a raw material required for photosynthesis."
        },

        {
          id: "science-023",
          question: "विद्युत धारा को मापने के लिए किस यंत्र का उपयोग किया जाता है?",
          options: [
            "वोल्टमीटर",
            "अमीटर",
            "बैरोमीटर",
            "थर्मामीटर"
          ],
          question_en: "Which instrument is used to measure electric current?",
          options_en: [
            "Voltmeter",
            "Ammeter",
            "Barometer",
            "Thermometer"
          ],
          answer: 1,
          explanation: "An ammeter is used to measure electric current in a circuit."
        },

        {
          id: "science-024",
          question: "अम्ल का स्वाद सामान्यतः कैसा होता है?",
          options: [
            "मीठा",
            "कड़वा",
            "खट्टा",
            "नमकीन"
          ],
          question_en: "What does an acid generally taste like?",
          options_en: [
            "Sweet",
            "Bitter",
            "Sour",
            "Salty"
          ],
          answer: 2,
          explanation: "Acids generally have a sour taste, although chemicals should never be tasted in practice."
        },

        {
          id: "science-025",
          question: "सूर्य से पृथ्वी तक ऊर्जा मुख्य रूप से किस रूप में पहुँचती है?",
          options: [
            "ध्वनि तरंगों के रूप में",
            "विद्युतचुंबकीय विकिरण के रूप में",
            "जल तरंगों के रूप में",
            "यांत्रिक तरंगों के रूप में"
          ],
          question_en: "In what form does energy from the Sun mainly reach Earth?",
          options_en: [
            "As sound waves",
            "As electromagnetic radiation",
            "As water waves",
            "As mechanical waves"
          ],
          answer: 1,
          explanation: "Energy from the Sun reaches Earth mainly through electromagnetic radiation, including visible light and infrared radiation."
        }
      ]
    },





    {
      id: "monthly-demo-002",
      type: "monthly",
      title: "Science Quiz 01",
      startAt: "2026-09-22T14:00:00+05:30",
      endAt: "2026-10-28T15:00:00+05:30",
      durationMinutes: 30,
      marksPerQuestion: 1,
      negativeMarks: 0,
      questions: [
        {
          id: "science-001",
          question: "कोशिका का पावरहाउस किस कोशिकांग को कहा जाता है?",
          options: [
            "केंद्रक",
            "राइबोसोम",
            "माइटोकॉन्ड्रिया",
            "गॉल्जी तंत्र"
          ],
          question_en: "Which organelle is known as the powerhouse of the cell?",
          options_en: [
            "Nucleus",
            "Ribosome",
            "Mitochondria",
            "Golgi Apparatus"
          ],
          answer: 2,
          explanation: "Mitochondria produce ATP, which provides usable energy for many cellular activities."
        },

        {
          id: "science-002",
          question: "बल की SI इकाई क्या है?",
          options: [
            "जूल",
            "न्यूटन",
            "वाट",
            "पास्कल"
          ],
          question_en: "What is the SI unit of force?",
          options_en: [
            "Joule",
            "Newton",
            "Watt",
            "Pascal"
          ],
          answer: 1,
          explanation: "The SI unit of force is Newton (N)."
        },

        {
          id: "science-003",
          question: "जल का रासायनिक सूत्र क्या है?",
          options: [
            "कार्बन डाइऑक्साइड",
            "ऑक्सीजन",
            "H₂O",
            "हाइड्रोजन"
          ],
          question_en: "What is the chemical formula of water?",
          options_en: [
            "CO₂",
            "O₂",
            "H₂O",
            "H₂"
          ],
          answer: 2,
          explanation: "One water molecule contains two hydrogen atoms and one oxygen atom."
        },

        {
          id: "science-004",
          question: "प्रकाश संश्लेषण के दौरान पौधे मुख्य रूप से किस गैस का उपयोग करते हैं?",
          options: [
            "ऑक्सीजन",
            "नाइट्रोजन",
            "कार्बन डाइऑक्साइड",
            "हाइड्रोजन"
          ],
          question_en: "Which gas is mainly used by plants during photosynthesis?",
          options_en: [
            "Oxygen",
            "Nitrogen",
            "Carbon dioxide",
            "Hydrogen"
          ],
          answer: 2,
          explanation: "Plants use carbon dioxide, water and sunlight to make food through photosynthesis."
        },

        {
          id: "science-005",
          question: "कौन-सी रक्त कोशिकाएँ संक्रमण से लड़ने में मदद करती हैं?",
          options: [
            "लाल रक्त कोशिकाएँ",
            "श्वेत रक्त कोशिकाएँ",
            "प्लेटलेट्स",
            "प्लाज्मा"
          ],
          question_en: "Which blood cells help fight infections?",
          options_en: [
            "Red Blood Cells",
            "White Blood Cells",
            "Platelets",
            "Plasma"
          ],
          answer: 1,
          explanation: "White blood cells are an important part of the body's immune system."
        },

        {
          id: "science-006",
          question: "पृथ्वी पर गुरुत्वीय त्वरण का लगभग मान कितना है?",
          options: [
            "4.9 मीटर/सेकंड²",
            "9.8 मीटर/सेकंड²",
            "19.6 मीटर/सेकंड²",
            "98 मीटर/सेकंड²"
          ],
          question_en: "What is the approximate acceleration due to gravity on Earth?",
          options_en: [
            "4.9 m/s²",
            "9.8 m/s²",
            "19.6 m/s²",
            "98 m/s²"
          ],
          answer: 1,
          explanation: "The acceleration due to gravity near Earth's surface is approximately 9.8 m/s²."
        },

        {
          id: "science-007",
          question: "पौधे का कौन-सा भाग मिट्टी से अधिकांश जल और खनिजों को अवशोषित करता है?",
          options: [
            "तना",
            "पत्ती",
            "जड़ के रोम",
            "फूल"
          ],
          question_en: "Which part of a plant absorbs most water and minerals from the soil?",
          options_en: [
            "Stem",
            "Leaf",
            "Root hairs",
            "Flower"
          ],
          answer: 2,
          explanation: "Root hairs increase the surface area available for absorbing water and minerals."
        },

        {
          id: "science-008",
          question: "सूर्य के प्रकाश के संपर्क में आने पर त्वचा में मुख्य रूप से कौन-सा विटामिन बनता है?",
          options: [
            "विटामिन A",
            "विटामिन B",
            "विटामिन C",
            "विटामिन D"
          ],
          question_en: "Which vitamin is mainly produced in the skin through sunlight exposure?",
          options_en: [
            "Vitamin A",
            "Vitamin B",
            "Vitamin C",
            "Vitamin D"
          ],
          answer: 3,
          explanation: "UVB radiation from sunlight helps the skin produce vitamin D."
        },

        {
          id: "science-009",
          question: "अधिकांश जीवों में आनुवंशिक जानकारी कौन-सा अणु वहन करता है?",
          options: [
            "ATP",
            "DNA",
            "ग्लूकोज़",
            "प्रोटीन"
          ],
          question_en: "Which molecule carries genetic information in most living organisms?",
          options_en: [
            "ATP",
            "DNA",
            "Glucose",
            "Protein"
          ],
          answer: 1,
          explanation: "DNA stores genetic instructions used by living organisms."
        },

        {
          id: "science-010",
          question: "25°C पर एक उदासीन विलयन का pH कितना होता है?",
          options: [
            "0",
            "5",
            "7",
            "14"
          ],
          question_en: "What is the pH of a neutral solution at 25°C?",
          options_en: [
            "0",
            "5",
            "7",
            "14"
          ],
          answer: 2,
          explanation: "At 25°C, a neutral aqueous solution has a pH of approximately 7."
        },

        {
          id: "science-011",
          question: "कौन-सा नियम कहता है कि प्रत्येक क्रिया की बराबर और विपरीत प्रतिक्रिया होती है?",
          options: [
            "न्यूटन का प्रथम नियम",
            "न्यूटन का द्वितीय नियम",
            "न्यूटन का तृतीय नियम",
            "गुरुत्वाकर्षण का नियम"
          ],
          question_en: "Which law states that every action has an equal and opposite reaction?",
          options_en: [
            "Newton's First Law",
            "Newton's Second Law",
            "Newton's Third Law",
            "Law of Gravitation"
          ],
          answer: 2,
          explanation: "Newton's third law describes action and reaction force pairs."
        },

        {
          id: "science-012",
          question: "कौन-सी संरचना यह नियंत्रित करती है कि कोशिका के अंदर क्या प्रवेश करे और बाहर क्या जाए?",
          options: [
            "कोशिका भित्ति",
            "कोशिका झिल्ली",
            "केंद्रक",
            "कोशिकाद्रव्य"
          ],
          question_en: "Which structure controls what enters and leaves a cell?",
          options_en: [
            "Cell wall",
            "Cell membrane",
            "Nucleus",
            "Cytoplasm"
          ],
          answer: 1,
          explanation: "The cell membrane regulates the movement of substances into and out of the cell."
        },

        {
          id: "science-013",
          question: "हमारे सौरमंडल का सबसे बड़ा ग्रह कौन-सा है?",
          options: [
            "पृथ्वी",
            "शनि",
            "बृहस्पति",
            "वरुण"
          ],
          question_en: "Which is the largest planet in our Solar System?",
          options_en: [
            "Earth",
            "Saturn",
            "Jupiter",
            "Neptune"
          ],
          answer: 2,
          explanation: "Jupiter is the largest planet in the Solar System."
        },

        {
          id: "science-014",
          question: "मानव शरीर का सबसे बड़ा अंग कौन-सा है?",
          options: [
            "हृदय",
            "यकृत",
            "त्वचा",
            "मस्तिष्क"
          ],
          question_en: "Which is the largest organ of the human body?",
          options_en: [
            "Heart",
            "Liver",
            "Skin",
            "Brain"
          ],
          answer: 2,
          explanation: "The skin is the body's largest organ and forms a protective barrier."
        },

        {
          id: "science-015",
          question: "निर्वात में प्रकाश की लगभग गति कितनी होती है?",
          options: [
            "3 × 10⁶ मीटर/सेकंड",
            "3 × 10⁷ मीटर/सेकंड",
            "3 × 10⁸ मीटर/सेकंड",
            "3 × 10⁹ मीटर/सेकंड"
          ],
          question_en: "What is the approximate speed of light in vacuum?",
          options_en: [
            "3 × 10⁶ m/s",
            "3 × 10⁷ m/s",
            "3 × 10⁸ m/s",
            "3 × 10⁹ m/s"
          ],
          answer: 2,
          explanation: "Light travels through vacuum at approximately 3 × 10⁸ metres per second."
        },

        {
          id: "science-016",
          question: "मानव मस्तिष्क का कौन-सा भाग संतुलन और समन्वय को नियंत्रित करता है?",
          options: [
            "प्रमस्तिष्क",
            "अनुमस्तिष्क",
            "मेडुला",
            "हाइपोथैलेमस"
          ],
          question_en: "Which part of the human brain controls balance and coordination?",
          options_en: [
            "Cerebrum",
            "Cerebellum",
            "Medulla",
            "Hypothalamus"
          ],
          answer: 1,
          explanation: "The cerebellum plays an important role in balance, posture and coordination of movements."
        },

        // NEW SCIENCE QUESTIONS

        {
          id: "science-017",
          question: "मनुष्य के शरीर में रक्त को पंप करने वाला अंग कौन-सा है?",
          options: [
            "फेफड़े",
            "हृदय",
            "गुर्दे",
            "यकृत"
          ],
          question_en: "Which organ pumps blood throughout the human body?",
          options_en: [
            "Lungs",
            "Heart",
            "Kidneys",
            "Liver"
          ],
          answer: 1,
          explanation: "The heart pumps blood throughout the body."
        },

        {
          id: "science-018",
          question: "पौधों में भोजन का परिवहन किस ऊतक द्वारा होता है?",
          options: [
            "जाइलम",
            "फ्लोएम",
            "मेरिस्टेम",
            "एपिडर्मिस"
          ],
          question_en: "Which tissue transports food in plants?",
          options_en: [
            "Xylem",
            "Phloem",
            "Meristem",
            "Epidermis"
          ],
          answer: 1,
          explanation: "Phloem transports food produced by leaves to different parts of the plant."
        },

        {
          id: "science-019",
          question: "ध्वनि किस माध्यम में सबसे तेज गति से यात्रा करती है?",
          options: [
            "वायु",
            "जल",
            "ठोस",
            "निर्वात"
          ],
          question_en: "In which medium does sound travel fastest?",
          options_en: [
            "Air",
            "Water",
            "Solids",
            "Vacuum"
          ],
          answer: 2,
          explanation: "Sound generally travels fastest through solids because their particles are closely packed."
        },

        {
          id: "science-020",
          question: "मानव शरीर में ऑक्सीजन का परिवहन मुख्य रूप से किसके द्वारा होता है?",
          options: [
            "प्लाज्मा",
            "हीमोग्लोबिन",
            "प्लेटलेट्स",
            "श्वेत रक्त कोशिकाएँ"
          ],
          question_en: "What mainly transports oxygen in the human body?",
          options_en: [
            "Plasma",
            "Hemoglobin",
            "Platelets",
            "White blood cells"
          ],
          answer: 1,
          explanation: "Hemoglobin in red blood cells binds with oxygen and helps transport it through the body."
        },

        {
          id: "science-021",
          question: "पानी का क्वथनांक सामान्य वायुमंडलीय दाब पर कितना होता है?",
          options: [
            "0°C",
            "50°C",
            "100°C",
            "200°C"
          ],
          question_en: "What is the boiling point of water at normal atmospheric pressure?",
          options_en: [
            "0°C",
            "50°C",
            "100°C",
            "200°C"
          ],
          answer: 2,
          explanation: "Water boils at 100°C at standard atmospheric pressure."
        },

        {
          id: "science-022",
          question: "किस गैस की कमी से पौधों में प्रकाश संश्लेषण की दर कम हो सकती है?",
          options: [
            "ऑक्सीजन",
            "कार्बन डाइऑक्साइड",
            "नाइट्रोजन",
            "हीलियम"
          ],
          question_en: "A shortage of which gas can reduce the rate of photosynthesis in plants?",
          options_en: [
            "Oxygen",
            "Carbon dioxide",
            "Nitrogen",
            "Helium"
          ],
          answer: 1,
          explanation: "Carbon dioxide is a raw material required for photosynthesis."
        },

        {
          id: "science-023",
          question: "विद्युत धारा को मापने के लिए किस यंत्र का उपयोग किया जाता है?",
          options: [
            "वोल्टमीटर",
            "अमीटर",
            "बैरोमीटर",
            "थर्मामीटर"
          ],
          question_en: "Which instrument is used to measure electric current?",
          options_en: [
            "Voltmeter",
            "Ammeter",
            "Barometer",
            "Thermometer"
          ],
          answer: 1,
          explanation: "An ammeter is used to measure electric current in a circuit."
        },

        {
          id: "science-024",
          question: "अम्ल का स्वाद सामान्यतः कैसा होता है?",
          options: [
            "मीठा",
            "कड़वा",
            "खट्टा",
            "नमकीन"
          ],
          question_en: "What does an acid generally taste like?",
          options_en: [
            "Sweet",
            "Bitter",
            "Sour",
            "Salty"
          ],
          answer: 2,
          explanation: "Acids generally have a sour taste, although chemicals should never be tasted in practice."
        },

        {
          id: "science-025",
          question: "सूर्य से पृथ्वी तक ऊर्जा मुख्य रूप से किस रूप में पहुँचती है?",
          options: [
            "ध्वनि तरंगों के रूप में",
            "विद्युतचुंबकीय विकिरण के रूप में",
            "जल तरंगों के रूप में",
            "यांत्रिक तरंगों के रूप में"
          ],
          question_en: "In what form does energy from the Sun mainly reach Earth?",
          options_en: [
            "As sound waves",
            "As electromagnetic radiation",
            "As water waves",
            "As mechanical waves"
          ],
          answer: 1,
          explanation: "Energy from the Sun reaches Earth mainly through electromagnetic radiation, including visible light and infrared radiation."
        }
      ]
    },



    {
      id: "monthly-demo-006",
      type: "monthly",
      title: "Science Quiz 01",
      startAt: "2026-09-22T14:00:00+05:30",
      endAt: "2026-10-28T15:00:00+05:30",
      durationMinutes: 10,
      marksPerQuestion: 1,
      negativeMarks: 0,
      questions: [
        {
          id: "social-001",
          question: "भारत का संविधान कब लागू हुआ?",
          options: [
            "15 अगस्त 1947",
            "26 जनवरी 1950",
            "26 नवंबर 1949",
            "2 अक्टूबर 1950"
          ],
          question_en: "When did the Constitution of India come into effect?",
          options_en: [
            "15 August 1947",
            "26 January 1950",
            "26 November 1949",
            "2 October 1950"
          ],
          answer: 1,
          explanation: "The Constitution of India came into effect on 26 January 1950."
        },

        {
          id: "social-002",
          question: "भारत की राजधानी कौन-सी है?",
          options: [
            "मुंबई",
            "कोलकाता",
            "नई दिल्ली",
            "चेन्नई"
          ],
          question_en: "What is the capital of India?",
          options_en: [
            "Mumbai",
            "Kolkata",
            "New Delhi",
            "Chennai"
          ],
          answer: 2,
          explanation: "New Delhi is the capital of India."
        },

        {
          id: "social-003",
          question: "भारत में कितने राज्य हैं?",
          options: [
            "26",
            "28",
            "29",
            "30"
          ],
          question_en: "How many states are there in India?",
          options_en: [
            "26",
            "28",
            "29",
            "30"
          ],
          answer: 1,
          explanation: "India currently has 28 states."
        },

        {
          id: "social-004",
          question: "भारत का राष्ट्रीय पशु कौन-सा है?",
          options: [
            "शेर",
            "हाथी",
            "बाघ",
            "हिरण"
          ],
          question_en: "What is the national animal of India?",
          options_en: [
            "Lion",
            "Elephant",
            "Tiger",
            "Deer"
          ],
          answer: 2,
          explanation: "The Bengal tiger is the national animal of India."
        },

        {
          id: "social-005",
          question: "भारतीय संविधान की प्रस्तावना किस शब्दों से शुरू होती है?",
          options: [
            "जय हिंद",
            "हम भारत के लोग",
            "सत्यमेव जयते",
            "भारत माता की जय"
          ],
          question_en: "Which words begin the Preamble of the Indian Constitution?",
          options_en: [
            "Jai Hind",
            "We, the People of India",
            "Satyameva Jayate",
            "Bharat Mata Ki Jai"
          ],
          answer: 1,
          explanation: "The Preamble begins with the words 'We, the People of India'."
        },

        {
          id: "social-006",
          question: "भारत में मतदान करने की न्यूनतम आयु कितनी है?",
          options: [
            "16 वर्ष",
            "18 वर्ष",
            "21 वर्ष",
            "25 वर्ष"
          ],
          question_en: "What is the minimum voting age in India?",
          options_en: [
            "16 years",
            "18 years",
            "21 years",
            "25 years"
          ],
          answer: 1,
          explanation: "Indian citizens can vote in elections from the age of 18, subject to the applicable electoral rules."
        },

        {
          id: "social-007",
          question: "भारत में हरित क्रांति मुख्य रूप से किससे संबंधित थी?",
          options: [
            "औद्योगिक उत्पादन",
            "कृषि उत्पादन",
            "परिवहन",
            "खनन"
          ],
          question_en: "The Green Revolution in India was mainly related to what?",
          options_en: [
            "Industrial production",
            "Agricultural production",
            "Transport",
            "Mining"
          ],
          answer: 1,
          explanation: "The Green Revolution was mainly associated with increasing agricultural production through improved seeds, irrigation and farming practices."
        },

        {
          id: "social-008",
          question: "भारत का सबसे बड़ा राज्य क्षेत्रफल के आधार पर कौन-सा है?",
          options: [
            "मध्य प्रदेश",
            "उत्तर प्रदेश",
            "राजस्थान",
            "महाराष्ट्र"
          ],
          question_en: "Which is the largest Indian state by area?",
          options_en: [
            "Madhya Pradesh",
            "Uttar Pradesh",
            "Rajasthan",
            "Maharashtra"
          ],
          answer: 2,
          explanation: "Rajasthan is the largest Indian state by geographical area."
        },

        {
          id: "social-009",
          question: "पंचायती राज व्यवस्था मुख्य रूप से किस स्तर की शासन व्यवस्था है?",
          options: [
            "स्थानीय शासन",
            "केंद्रीय शासन",
            "अंतरराष्ट्रीय शासन",
            "न्यायिक शासन"
          ],
          question_en: "The Panchayati Raj system is mainly a form of which type of governance?",
          options_en: [
            "Local government",
            "Central government",
            "International government",
            "Judicial government"
          ],
          answer: 0,
          explanation: "Panchayati Raj is a system of local self-government in rural areas."
        },

        {
          id: "social-010",
          question: "भारतीय संसद के दो सदन कौन-से हैं?",
          options: [
            "लोकसभा और विधानसभा",
            "राज्यसभा और विधानसभा",
            "लोकसभा और राज्यसभा",
            "विधानसभा और विधान परिषद"
          ],
          question_en: "What are the two houses of the Parliament of India?",
          options_en: [
            "Lok Sabha and Vidhan Sabha",
            "Rajya Sabha and Vidhan Sabha",
            "Lok Sabha and Rajya Sabha",
            "Vidhan Sabha and Vidhan Parishad"
          ],
          answer: 2,
          explanation: "The Parliament of India consists of the Lok Sabha and the Rajya Sabha."
        }
      ]
    },

    /*
            {
                id: "monthly-demo-001",
                type: "monthly",
                title: "Science Quiz 01",
                startAt: "2026-09-22T14:00:00+05:30",
                endAt: "2026-10-10T15:00:00+05:30",
                durationMinutes: 30,
                marksPerQuestion: 1,
                negativeMarks: 0,
                questions: [
    
                   // paste questions here
                ]
            },
    */

    {
      id: "social-sciences-chapter-demo-001",
      type: "chapter",
      subject: "social-sciences",
      subjectName: "Social Sciences",
      chapter: "General Social quiz 01",
      title: "General Social Quiz",
      startAt: "2026-09-18T11:00:00+05:30",
      endAt: "2026-10-28T12:00:00+05:30",
      durationMinutes: 15,
      marksPerQuestion: 4,
      negativeMarks: -1,

      questions: [
        {
          id: "social-001",
          question: "भारत का संविधान कब लागू हुआ?",
          options: [
            "15 अगस्त 1947",
            "26 जनवरी 1950",
            "26 नवंबर 1949",
            "2 अक्टूबर 1950"
          ],
          question_en: "When did the Constitution of India come into effect?",
          options_en: [
            "15 August 1947",
            "26 January 1950",
            "26 November 1949",
            "2 October 1950"
          ],
          answer: 1,
          explanation: "The Constitution of India came into effect on 26 January 1950."
        },

        {
          id: "social-002",
          question: "भारत की राजधानी कौन-सी है?",
          options: [
            "मुंबई",
            "कोलकाता",
            "नई दिल्ली",
            "चेन्नई"
          ],
          question_en: "What is the capital of India?",
          options_en: [
            "Mumbai",
            "Kolkata",
            "New Delhi",
            "Chennai"
          ],
          answer: 2,
          explanation: "New Delhi is the capital of India."
        },

        {
          id: "social-003",
          question: "भारत में कितने राज्य हैं?",
          options: [
            "26",
            "28",
            "29",
            "30"
          ],
          question_en: "How many states are there in India?",
          options_en: [
            "26",
            "28",
            "29",
            "30"
          ],
          answer: 1,
          explanation: "India currently has 28 states."
        },

        {
          id: "social-004",
          question: "भारत का राष्ट्रीय पशु कौन-सा है?",
          options: [
            "शेर",
            "हाथी",
            "बाघ",
            "हिरण"
          ],
          question_en: "What is the national animal of India?",
          options_en: [
            "Lion",
            "Elephant",
            "Tiger",
            "Deer"
          ],
          answer: 2,
          explanation: "The Bengal tiger is the national animal of India."
        },

        {
          id: "social-005",
          question: "भारतीय संविधान की प्रस्तावना किस शब्दों से शुरू होती है?",
          options: [
            "जय हिंद",
            "हम भारत के लोग",
            "सत्यमेव जयते",
            "भारत माता की जय"
          ],
          question_en: "Which words begin the Preamble of the Indian Constitution?",
          options_en: [
            "Jai Hind",
            "We, the People of India",
            "Satyameva Jayate",
            "Bharat Mata Ki Jai"
          ],
          answer: 1,
          explanation: "The Preamble begins with the words 'We, the People of India'."
        },

        {
          id: "social-006",
          question: "भारत में मतदान करने की न्यूनतम आयु कितनी है?",
          options: [
            "16 वर्ष",
            "18 वर्ष",
            "21 वर्ष",
            "25 वर्ष"
          ],
          question_en: "What is the minimum voting age in India?",
          options_en: [
            "16 years",
            "18 years",
            "21 years",
            "25 years"
          ],
          answer: 1,
          explanation: "Indian citizens can vote in elections from the age of 18, subject to the applicable electoral rules."
        },

        {
          id: "social-007",
          question: "भारत में हरित क्रांति मुख्य रूप से किससे संबंधित थी?",
          options: [
            "औद्योगिक उत्पादन",
            "कृषि उत्पादन",
            "परिवहन",
            "खनन"
          ],
          question_en: "The Green Revolution in India was mainly related to what?",
          options_en: [
            "Industrial production",
            "Agricultural production",
            "Transport",
            "Mining"
          ],
          answer: 1,
          explanation: "The Green Revolution was mainly associated with increasing agricultural production through improved seeds, irrigation and farming practices."
        },

        {
          id: "social-008",
          question: "भारत का सबसे बड़ा राज्य क्षेत्रफल के आधार पर कौन-सा है?",
          options: [
            "मध्य प्रदेश",
            "उत्तर प्रदेश",
            "राजस्थान",
            "महाराष्ट्र"
          ],
          question_en: "Which is the largest Indian state by area?",
          options_en: [
            "Madhya Pradesh",
            "Uttar Pradesh",
            "Rajasthan",
            "Maharashtra"
          ],
          answer: 2,
          explanation: "Rajasthan is the largest Indian state by geographical area."
        },

        {
          id: "social-009",
          question: "पंचायती राज व्यवस्था मुख्य रूप से किस स्तर की शासन व्यवस्था है?",
          options: [
            "स्थानीय शासन",
            "केंद्रीय शासन",
            "अंतरराष्ट्रीय शासन",
            "न्यायिक शासन"
          ],
          question_en: "The Panchayati Raj system is mainly a form of which type of governance?",
          options_en: [
            "Local government",
            "Central government",
            "International government",
            "Judicial government"
          ],
          answer: 0,
          explanation: "Panchayati Raj is a system of local self-government in rural areas."
        },

        {
          id: "social-010",
          question: "भारतीय संसद के दो सदन कौन-से हैं?",
          options: [
            "लोकसभा और विधानसभा",
            "राज्यसभा और विधानसभा",
            "लोकसभा और राज्यसभा",
            "विधानसभा और विधान परिषद"
          ],
          question_en: "What are the two houses of the Parliament of India?",
          options_en: [
            "Lok Sabha and Vidhan Sabha",
            "Rajya Sabha and Vidhan Sabha",
            "Lok Sabha and Rajya Sabha",
            "Vidhan Sabha and Vidhan Parishad"
          ],
          answer: 2,
          explanation: "The Parliament of India consists of the Lok Sabha and the Rajya Sabha."
        }
      ]
    },

    {
      id: "maths-chapter-demo-001",
      type: "chapter",
      subject: "maths",
      subjectName: "maths",
      chapter: "General Maths quiz 01",
      title: "General Maths Quiz",
      startAt: "2026-09-18T11:00:00+05:30",
      endAt: "2026-10-18T12:00:00+05:30",
      durationMinutes: 30,
      marksPerQuestion: 4,
      negativeMarks: -1,

      questions: [
        {
          id: "math-001",
          question: "यदि 15 + 27 = ?",
          options: [
            "32",
            "42",
            "52",
            "40"
          ],
          question_en: "What is 15 + 27?",
          options_en: [
            "32",
            "42",
            "52",
            "40"
          ],
          answer: 1,
          explanation: "15 + 27 = 42."
        },

        {
          id: "math-002",
          question: "144 का वर्गमूल क्या है?",
          options: [
            "10",
            "11",
            "12",
            "14"
          ],
          question_en: "What is the square root of 144?",
          options_en: [
            "10",
            "11",
            "12",
            "14"
          ],
          answer: 2,
          explanation: "12 × 12 = 144, so √144 = 12."
        },

        {
          id: "math-003",
          question: "एक त्रिभुज के तीनों कोणों का योग कितना होता है?",
          options: [
            "90°",
            "180°",
            "270°",
            "360°"
          ],
          question_en: "What is the sum of the three angles of a triangle?",
          options_en: [
            "90°",
            "180°",
            "270°",
            "360°"
          ],
          answer: 1,
          explanation: "The sum of the interior angles of a triangle is 180°."
        },

        {
          id: "math-004",
          question: "यदि x + 7 = 15 है, तो x का मान क्या होगा?",
          options: [
            "6",
            "7",
            "8",
            "9"
          ],
          question_en: "If x + 7 = 15, what is the value of x?",
          options_en: [
            "6",
            "7",
            "8",
            "9"
          ],
          answer: 2,
          explanation: "Subtract 7 from both sides: x = 15 − 7 = 8."
        },

        {
          id: "math-005",
          question: "एक वर्ग की भुजा 6 cm है। उसका क्षेत्रफल कितना होगा?",
          options: [
            "12 cm²",
            "24 cm²",
            "36 cm²",
            "48 cm²"
          ],
          question_en: "A square has a side of 6 cm. What is its area?",
          options_en: [
            "12 cm²",
            "24 cm²",
            "36 cm²",
            "48 cm²"
          ],
          answer: 2,
          explanation: "Area of a square = side² = 6² = 36 cm²."
        },

        {
          id: "math-006",
          question: "2³ × 2² का मान क्या है?",
          options: [
            "16",
            "24",
            "32",
            "64"
          ],
          question_en: "What is the value of 2³ × 2²?",
          options_en: [
            "16",
            "24",
            "32",
            "64"
          ],
          answer: 2,
          explanation: "Using aᵐ × aⁿ = aᵐ⁺ⁿ, 2³ × 2² = 2⁵ = 32."
        },

        {
          id: "math-007",
          question: "एक वृत्त की त्रिज्या 7 cm है। उसका क्षेत्रफल क्या होगा? (π = 22/7)",
          options: [
            "44 cm²",
            "154 cm²",
            "308 cm²",
            "49 cm²"
          ],
          question_en: "A circle has a radius of 7 cm. What is its area? (π = 22/7)",
          options_en: [
            "44 cm²",
            "154 cm²",
            "308 cm²",
            "49 cm²"
          ],
          answer: 1,
          explanation: "Area = πr² = (22/7) × 7 × 7 = 154 cm²."
        },

        {
          id: "math-008",
          question: "यदि किसी संख्या का 25% = 20 है, तो वह संख्या क्या है?",
          options: [
            "40",
            "60",
            "80",
            "100"
          ],
          question_en: "If 25% of a number is 20, what is the number?",
          options_en: [
            "40",
            "60",
            "80",
            "100"
          ],
          answer: 2,
          explanation: "25% of x = 20, so x = 20 ÷ 0.25 = 80."
        },

        {
          id: "math-009",
          question: "एक आयत की लंबाई 12 cm और चौड़ाई 5 cm है। उसका परिमाप कितना होगा?",
          options: [
            "17 cm",
            "24 cm",
            "34 cm",
            "60 cm"
          ],
          question_en: "A rectangle has a length of 12 cm and a width of 5 cm. What is its perimeter?",
          options_en: [
            "17 cm",
            "24 cm",
            "34 cm",
            "60 cm"
          ],
          answer: 2,
          explanation: "Perimeter = 2(l + w) = 2(12 + 5) = 34 cm."
        },

        {
          id: "math-010",
          question: "यदि a = 5 और b = 3 है, तो a² + b² का मान क्या होगा?",
          options: [
            "25",
            "28",
            "34",
            "64"
          ],
          question_en: "If a = 5 and b = 3, what is the value of a² + b²?",
          options_en: [
            "25",
            "28",
            "34",
            "64"
          ],
          answer: 2,
          explanation: "a² + b² = 5² + 3² = 25 + 9 = 34."
        }
      ]

    },


    /*
            {
                id: "maths-chapter-demo-001",
                type: "chapter",
                subject: "maths",
                subjectName: "Maths",
                chapter: "Quadratic Equations",
                title: "Quadratic Equations — Chapter Quiz",
                startAt: "2026-09-18T11:00:00+05:30",
                endAt: "2026-09-18T12:00:00+05:30",
                durationMinutes: 15,
                marksPerQuestion: 4,
                negativeMarks: 1,
                questions: [
                    {
                        id: "q1",
                        question: "Which is the standard form of a quadratic equation?",
                        options: ["ax + b = 0", "ax² + bx + c = 0", "a/x = b", "x + y = 0"],
                        answer: 1
                    },
                    {
                        id: "q2",
                        question: "What is the degree of a quadratic equation?",
                        options: ["1", "2", "3", "4"],
                        answer: 1
                    }
                ]
            }
            */
  ];

  const $ = (id) => document.getElementById(id);

  // Unfinished quiz attempts are stored separately from submitted history.
  // This lets a student leave and later resume the same attempt without getting a fresh attempt.
  const quizDraftStorageKey = "bccQuizDraftsV1";

  const state = {
    quiz: null,
    index: 0,
    answers: [],
    visited: [],
    seconds: 0,
    timer: null,
    finished: false,
    result: null,
    attemptRecord: null,
    medium: "en"
  };

  initialise();

  async function initialise() {
    bindEvents();
    renderRecentHistory();
    window.addEventListener("pagehide", saveCurrentDraft);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") saveCurrentDraft();
    });
    await refreshStatus();
  }

  function bindEvents() {
    // Weekly and Monthly cards are rendered dynamically so multiple quizzes
    // of the same type can exist at the same time.
    $("chapterQuizCard").addEventListener("click", showSubjectQuizzes);
    $("backToQuizTypes").addEventListener("click", () => {
      $("subjectQuizSection").hidden = true;
    });

    $("previousQuestion").addEventListener("click", previousQuestion);
    $("nextQuestion").addEventListener("click", nextQuestion);
    $("submitQuizButton").addEventListener("click", confirmSubmit);
    $("cancelSubmitButton").addEventListener("click", closeConfirm);
    $("confirmSubmitButton").addEventListener("click", finishQuiz);
    $("closeResultButton").addEventListener("click", closeResult);
    $("downloadResultButton").addEventListener("click", downloadCurrentAnalysis);
    $("closeNoQuizButton").addEventListener("click", closeNoQuiz);

    document.querySelectorAll(".medium-button").forEach((button) => {
      button.addEventListener("click", () => setQuizMedium(button.dataset.medium));
    });

    $("notificationBtn").addEventListener("click", () => {
      notify("Quiz notifications will appear here when connected to the backend.");
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;

      if ($("quizConfirmModal").classList.contains("show")) {
        closeConfirm();
      } else if ($("noQuizScreen").classList.contains("show")) {
        closeNoQuiz();
      }
    });
  }

  async function refreshStatus() {
    const date = localDate();

    const [weeklyQuizzes, monthlyQuizzes, ...chapterResults] = await Promise.all([
      getQuizzes("weekly", null, date),
      getQuizzes("monthly", null, date),
      ...subjects.map((subject) => getQuizzes("chapter", subject.id, date))
    ]);

    const weeklyActive = weeklyQuizzes.filter(isQuizActive);
    const monthlyActive = monthlyQuizzes.filter(isQuizActive);
    const activeChapters = [];

    chapterResults.forEach((quizzes, index) => {
      quizzes.filter(isQuizActive).forEach((quiz) => {
        activeChapters.push({ quiz, subject: subjects[index] });
      });
    });

    renderScheduledCards("weekly", weeklyQuizzes);
    renderScheduledCards("monthly", monthlyQuizzes);

    const activeNames = [];

    weeklyActive.forEach((quiz) => {
      activeNames.push(quiz.title || "Weekly Quiz");
    });
    monthlyActive.forEach((quiz) => {
      activeNames.push(quiz.title || "Monthly Quiz");
    });
    activeChapters.forEach(({ quiz, subject }) => {
      activeNames.push(quiz.title || subject.name + " Chapter Quiz");
    });

    if (activeNames.length) {
      $("quizStatusTitle").textContent = activeNames.join(" • ");
      $("quizStatusText").textContent = "This quiz is currently active. Open its card to start.";
      $("quizStatusBadge").textContent = "ACTIVE";
      $("quizStatusBadge").className = "quiz-status-badge active";
    } else {
      $("quizStatusTitle").textContent = "No quiz is active right now.";
      $("quizStatusText").textContent = "Weekly, Monthly and Chapter-wise quizzes are available according to the schedule set by the admin.";
      $("quizStatusBadge").textContent = "NO ACTIVE QUIZ";
      $("quizStatusBadge").className = "quiz-status-badge inactive";
    }
  }

  function quizIsExpired(quiz) {
    if (!quiz) return true;
    if (quiz.active === false) return true;

    if (quiz.endAt) {
      const end = new Date(quiz.endAt).getTime();
      return Number.isNaN(end) ? true : Date.now() > end;
    }

    if (quiz.date && !quiz.startAt) {
      return quiz.date < localDate();
    }

    return false;
  }

  function renderScheduledCards(type, quizzes) {
    const firstCard = $(type + "QuizCard");
    if (!firstCard) return;

    const container = firstCard.parentElement;
    if (!container) return;

    // The first card is the permanent card for this quiz type.
    // Extra cards are created only while their quiz is ACTIVE.
    const template = firstCard.cloneNode(true);

    container.querySelectorAll('[data-dynamic-quiz-card="' + type + '"]').forEach((card) => {
      card.remove();
    });

    firstCard.remove();

    const allQuizzes = Array.isArray(quizzes)
      ? quizzes.filter((quiz) => quiz && quiz.active !== false)
      : [];

    // Only quizzes whose startAt/endAt window is active are shown.
    // Expired and upcoming quizzes do not create extra cards.
    const activeQuizzes = allQuizzes
      .filter(isQuizActive)
      .sort((a, b) => {
        const aStart = a.startAt ? new Date(a.startAt).getTime() : -Infinity;
        const bStart = b.startAt ? new Date(b.startAt).getTime() : -Infinity;

        if (aStart !== bStart) return aStart - bStart;
        return String(a.id || "").localeCompare(String(b.id || ""));
      });

    // Always render exactly one permanent card.
    // If nothing is active, it becomes the "No Active Quiz" card.
    const permanentQuiz = activeQuizzes[0] || null;
    const permanentCard = template.cloneNode(true);

    permanentCard.dataset.dynamicQuizCard = type;
    permanentCard.id = type + "QuizCard";

    setScheduledCard(
      permanentCard,
      type,
      permanentQuiz,
      Boolean(permanentQuiz)
    );

    if (permanentQuiz) {
      permanentCard.dataset.quizId = String(permanentQuiz.id || "");
      permanentCard.addEventListener("click", () => {
        openScheduledQuiz(type, permanentQuiz.id);
      });
    }

    container.appendChild(permanentCard);

    // Every other ACTIVE quiz gets its own temporary extra card.
    // When its schedule expires, this card disappears on the next refresh.
    activeQuizzes.slice(1).forEach((quiz, index) => {
      const card = template.cloneNode(true);

      card.dataset.dynamicQuizCard = type;
      card.dataset.quizId = String(quiz.id || "");
      card.id = type + "QuizCard-" + safeQuizId(quiz.id, index + 2);

      setScheduledCard(card, type, quiz, true);

      card.addEventListener("click", () => {
        openScheduledQuiz(type, quiz.id);
      });

      container.appendChild(card);
    });
  }

  function safeQuizId(value, fallback) {
    const safe = String(value || "")
      .replace(/[^a-z0-9_-]/gi, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    return safe || String(fallback);
  }

  function setScheduledCard(card, type, quiz, active) {
    if (!card) return;

    const status = card.querySelector("#" + type + "QuizStatus");
    const description = card.querySelector("#" + type + "QuizDescription");
    const visualLabel = card.querySelector(".quiz-card-visual span");
    const titleLabel = card.querySelector(".quiz-card-title");
    const attempted = quiz ? getAttempt(quiz.id) : null;
    const draft = quiz ? getQuizDraft(quiz.id) : null;
    const inProgress = Boolean(draft && !attempted);

    // Remove duplicate IDs from cloned cards. The elements are still found
    // above before their IDs are rewritten.
    if (status) {
      status.id = card.id + "-status";
      status.classList.toggle("active", active && !attempted);
      status.classList.toggle("submitted", Boolean(attempted));
      status.classList.toggle("in-progress", active && inProgress);
    }
    if (description) description.id = card.id + "-description";

    card.classList.toggle("disabled", !active || Boolean(attempted));

    if (status) {
      if (attempted) status.textContent = "SUBMITTED";
      else if (inProgress) status.textContent = "IN PROGRESS";
      else status.textContent = active ? "ACTIVE" : "SCHEDULED";
    }

    if (visualLabel) {
      visualLabel.textContent = attempted
        ? "SUBMITTED"
        : (inProgress ? "RESUME" : (active ? "LIVE NOW" : "SCHEDULED"));
    }

    if (attempted) {
      if (description) {
        description.textContent =
          "Submitted • " + formatMarks(attempted.obtainedMarks) +
          " / " + formatMarks(attempted.totalMarks) +
          " marks. Reattempt is not allowed.";
      }
      return;
    }

    if (inProgress && active) {
      if (description) description.textContent = "Attempt already started • Resume your saved attempt.";
      return;
    }

    if (active && quiz) {
      if (description) description.textContent = quiz.title || "The quiz is ready to start.";
      return;
    }

    if (description) {
      description.textContent = quiz
        ? (getScheduleText(quiz) || "The quiz is ready to start.")
        : "No active quiz right now.";
    }
  }

  async function openScheduledQuiz(type, quizId) {
    const quizzes = await getQuizzes(type, null, localDate());
    const quiz = quizId
      ? quizzes.find((item) => String(item.id) === String(quizId))
      : quizzes.find(isQuizActive);

    if (!isQuizActive(quiz)) {
      showNoQuiz();
      return;
    }

    if (getAttempt(quiz.id)) {
      showSubmittedNotice(quiz);
      return;
    }

    startQuiz(quiz);
  }

  async function showSubjectQuizzes() {
    $("subjectQuizSection").hidden = false;
    $("subjectQuizGrid").innerHTML = '<div class="subject-loading">Checking active subject quizzes...</div>';

    const date = localDate();
    const results = await Promise.all(
      subjects.map(async (subject) => ({
        subject,
        quizzes: await getQuizzes("chapter", subject.id, date)
      }))
    );

    $("subjectQuizGrid").innerHTML = "";

    results.forEach(({ subject, quizzes }) => {
      const visibleQuizzes = quizzes.filter((quiz) => !quizIsExpired(quiz));

      if (!visibleQuizzes.length) {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "subject-quiz-card disabled";
        card.innerHTML = `
                    <div class="subject-quiz-icon"><i class="fa-solid ${subject.icon}"></i></div>
                    <span class="subject-quiz-status">NO QUIZ</span>
                    <h3>${escapeHtml(subject.name)}</h3>
                    <p>No active or upcoming chapter quiz.</p>
                `;
        card.addEventListener("click", showNoQuiz);
        $("subjectQuizGrid").appendChild(card);
        return;
      }

      visibleQuizzes.forEach((quiz) => {
        const active = isQuizActive(quiz);
        const attempted = getAttempt(quiz.id);
        const draft = getQuizDraft(quiz.id);
        const inProgress = Boolean(draft && !attempted);
        const card = document.createElement("button");

        card.type = "button";
        card.className = "subject-quiz-card" + (active && !attempted ? "" : " disabled");
        card.dataset.quizId = String(quiz.id || "");

        card.innerHTML = `
                    <div class="subject-quiz-icon">
                        <i class="fa-solid ${subject.icon}"></i>
                    </div>
                    <span class="subject-quiz-status ${attempted ? "submitted" : (inProgress ? "in-progress" : (active ? "active" : ""))}">
                        ${attempted ? "SUBMITTED" : (inProgress ? "IN PROGRESS" : (active ? "ACTIVE" : "SCHEDULED"))}
                    </span>
                    <h3>${escapeHtml(subject.name)}</h3>
                    <p>${attempted
            ? escapeHtml("Submitted • " + formatMarks(attempted.obtainedMarks) + " / " + formatMarks(attempted.totalMarks) + " marks. Reattempt not allowed.")
            : inProgress && active
              ? "Attempt already started • Resume your saved attempt."
              : active
                ? escapeHtml((quiz.title || "Chapter-wise quiz") + (quiz.chapter ? " • " + quiz.chapter : ""))
                : escapeHtml((quiz.title || "Chapter-wise quiz") + " • " + (getScheduleText(quiz) || "Scheduled"))}
                    </p>
                `;

        card.addEventListener("click", () => {
          if (attempted) showSubmittedNotice(quiz);
          else if (active) startQuiz(quiz);
          else showNoQuiz();
        });

        $("subjectQuizGrid").appendChild(card);
      });
    });
  }

  function enterQuizMode() {
    document.body.classList.add("quiz-active-mode");
    document.documentElement.classList.add("quiz-active-mode");

    // Best-effort landscape lock for phones/tablets. Browsers may reject
    // this unless the page is running in fullscreen/PWA mode, so CSS below
    // still provides the landscape layout when the browser cannot lock it.
    if (window.matchMedia("(max-width: 1100px)").matches &&
        screen.orientation &&
        typeof screen.orientation.lock === "function") {
      screen.orientation.lock("landscape").catch(() => {});
    }
  }

  function exitQuizMode() {
    document.body.classList.remove("quiz-active-mode");
    document.documentElement.classList.remove("quiz-active-mode");

    if (screen.orientation && typeof screen.orientation.unlock === "function") {
      try {
        screen.orientation.unlock();
      } catch (_) {}
    }
  }

  function startQuiz(quiz) {
    if (!quiz || !Array.isArray(quiz.questions) || !quiz.questions.length) {
      showNoQuiz();
      return;
    }

    const submittedAttempt = getAttempt(quiz.id);
    if (submittedAttempt) {
      showSubmittedNotice(quiz);
      return;
    }

    const draft = getQuizDraft(quiz.id);
    state.quiz = normalise(quiz);

    if (draft && isDraftCompatible(draft, state.quiz)) {
      // Resume the saved remaining time exactly. Time is paused while the
      // student is outside the quiz, so do not subtract wall-clock time.
      state.index = Number.isInteger(draft.index) ? Math.min(Math.max(draft.index, 0), state.quiz.questions.length - 1) : 0;
      state.answers = restoreAnswers(draft.answers, state.quiz.questions.length);
      state.visited = restoreVisited(draft.visited, state.quiz.questions.length);

      const savedSeconds = Number(draft.seconds);
      // Older broken drafts may contain 0/NaN for the timer. Preserve
      // saved answers and use the quiz duration as a safe timer fallback.
      state.seconds = Number.isFinite(savedSeconds) && savedSeconds > 0
        ? Math.floor(savedSeconds)
        : state.quiz.durationMinutes * 60;
      state.finished = false;
      state.medium = draft.medium === "hi" ? "hi" : "en";
    } else {
      // First start: create a locked-in attempt immediately.
      state.index = 0;
      state.answers = new Array(state.quiz.questions.length).fill(null);
      state.visited = new Array(state.quiz.questions.length).fill(false);
      state.seconds = state.quiz.durationMinutes * 60;
      state.finished = false;
      state.medium = "en";
    }

    updateMediumSwitch();

    $("runnerQuizTitle").textContent = state.quiz.title;
    $("questionTotal").textContent = state.quiz.questions.length;
    $("questionMarksLabel").textContent = "+" + state.quiz.marksPerQuestion + " / -" + state.quiz.negativeMarks;
    $("positiveMarksValue").textContent = formatMarks(state.quiz.marksPerQuestion);
    $("negativeMarksValue").textContent = formatMarks(state.quiz.negativeMarks);

    enterQuizMode();
    $("quizRunner").classList.add("show");
    $("quizRunner").setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    markVisited();
    renderQuestion();
    saveCurrentDraft();
    startTimer();
  }

  function normalise(quiz) {
    const copy = JSON.parse(JSON.stringify(quiz));

    copy.title = copy.title || "Quiz";
    copy.durationMinutes = Number(copy.durationMinutes) > 0
      ? Number(copy.durationMinutes)
      : 20;
    copy.marksPerQuestion = Number.isFinite(Number(copy.marksPerQuestion))
      ? Number(copy.marksPerQuestion)
      : 4;
    copy.negativeMarks = Number.isFinite(Number(copy.negativeMarks))
      ? Number(copy.negativeMarks)
      : 1;

    copy.questions = copy.questions.map((question) => {
      const normalisedQuestion = { ...question };

      // Keep track of which language fields were actually supplied.
      // This prevents an English-only legacy question from pretending
      // to have a Hindi version.
      normalisedQuestion._hasExplicitEnglish = Boolean(
        question.question_en || question.questionEnglish || Array.isArray(question.options_en)
      );
      normalisedQuestion._hasExplicitHindi = Boolean(
        question.question_hi || question.question_hi_IN || Array.isArray(question.options_hi)
      );

      // English is the default medium. For the bilingual format,
      // `question`/`options` are the Hindi paper and
      // `question_en`/`options_en` are the English paper.
      normalisedQuestion.question_hi =
        question.question_hi ?? question.question_hi_IN ?? question.question ?? "";
      normalisedQuestion.options_hi =
        Array.isArray(question.options_hi)
          ? question.options_hi
          : (Array.isArray(question.options) ? question.options : []);

      normalisedQuestion.question_en =
        question.question_en ?? question.questionEnglish ?? question.question ?? "";
      normalisedQuestion.options_en =
        Array.isArray(question.options_en)
          ? question.options_en
          : (Array.isArray(question.options) ? question.options : []);

      normalisedQuestion.marks = Number.isFinite(Number(question.marks))
        ? Number(question.marks)
        : copy.marksPerQuestion;
      normalisedQuestion.negativeMarks = Number.isFinite(Number(question.negativeMarks))
        ? Number(question.negativeMarks)
        : copy.negativeMarks;

      return normalisedQuestion;
    });

    return copy;
  }

  function renderQuestion() {
    const question = state.quiz.questions[state.index];

    $("questionNumberLabel").textContent = "Question " + (state.index + 1);

    const content = getQuestionContent(question, state.medium);
    $("questionText").textContent = content.question || "Question";
    $("optionsList").innerHTML = "";

    const letters = ["A", "B", "C", "D", "E", "F"];

    const questionAlreadyAnswered = state.answers[state.index] !== null &&
      state.answers[state.index] !== undefined;

    content.options.forEach((option, optionIndex) => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "quiz-option" + (
        state.answers[state.index] === optionIndex ? " selected" : ""
      ) + (questionAlreadyAnswered ? " locked" : "");
      button.disabled = questionAlreadyAnswered;
      if (questionAlreadyAnswered) {
        button.setAttribute("aria-disabled", "true");
        button.title = "This question has already been answered and cannot be changed.";
      }

      button.innerHTML = `
                <span class="quiz-option-letter">
                    ${letters[optionIndex] || optionIndex + 1}
                </span>
                <span>${escapeHtml(String(option))}</span>
            `;

      button.addEventListener("click", () => {
        // Lock an answered question permanently for this attempt.
        // Unanswered questions remain available for selection.
        if (state.answers[state.index] !== null && state.answers[state.index] !== undefined) return;
        state.answers[state.index] = optionIndex;
        saveCurrentDraft();
        renderQuestion();
      });

      $("optionsList").appendChild(button);
    });

    $("previousQuestion").disabled = state.index === 0;
    $("nextQuestion").innerHTML = state.index === state.quiz.questions.length - 1
      ? 'Submit <i class="fa-solid fa-paper-plane"></i>'
      : 'Next <i class="fa-solid fa-arrow-right"></i>';

    updateMediumSwitch();
    renderPalette();
  }

  function getQuestionContent(question, medium) {
    const isHindi = medium === "hi";

    const questionText = isHindi
      ? (question.question_hi || question.question || question.question_en || "Question")
      : (question.question_en || question.question || question.question_hi || "Question");

    const options = isHindi
      ? (Array.isArray(question.options_hi)
        ? question.options_hi
        : (Array.isArray(question.options) ? question.options : []))
      : (Array.isArray(question.options_en)
        ? question.options_en
        : (Array.isArray(question.options) ? question.options : []));

    return { question: questionText, options };
  }

  function setQuizMedium(medium) {
    if (!state.quiz) return;

    const requested = medium === "hi" ? "hi" : "en";
    const question = state.quiz.questions[state.index];

    if (requested === "hi" && !hasHindiContent(question)) {
      notify("Hindi medium is not available for this question.");
      return;
    }

    if (requested === "en" && !hasEnglishContent(question)) {
      notify("English medium is not available for this question.");
      return;
    }

    state.medium = requested;
    renderQuestion();
  }

  function updateMediumSwitch() {
    const switcher = $("quizMediumSwitch");
    if (!switcher) return;

    const currentQuestion = state.quiz?.questions?.[state.index];

    switcher.hidden = !currentQuestion ||
      (!hasEnglishContent(currentQuestion) && !hasHindiContent(currentQuestion));

    switcher.querySelectorAll(".medium-button").forEach((button) => {
      const active = button.dataset.medium === state.medium;
      const available = button.dataset.medium === "hi"
        ? hasHindiContent(currentQuestion)
        : hasEnglishContent(currentQuestion);

      button.classList.toggle("active", active);
      button.disabled = !available;
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function hasHindiContent(question) {
    if (!question) return false;

    const bilingualHindiFormat =
      question._hasExplicitEnglish &&
      !question._hasExplicitHindi &&
      String(question.question || "").trim() &&
      Array.isArray(question.options) &&
      question.options.length;

    return Boolean(
      question._hasExplicitHindi ||
      bilingualHindiFormat
    );
  }

  function hasEnglishContent(question) {
    if (!question) return false;

    const legacyEnglish =
      !question._hasExplicitEnglish &&
      !question._hasExplicitHindi &&
      String(question.question || "").trim() &&
      Array.isArray(question.options) &&
      question.options.length;

    return Boolean(question._hasExplicitEnglish || legacyEnglish);
  }

  function markVisited() {
    state.visited[state.index] = true;
  }

  function renderPalette() {
    $("questionPalette").innerHTML = "";

    state.quiz.questions.forEach((_, index) => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "question-number-button";

      if (state.visited[index]) button.classList.add("visited");
      if (state.answers[index] !== null) button.classList.add("attempted");
      if (index === state.index) button.classList.add("current");

      button.textContent = index + 1;

      button.addEventListener("click", () => {
        state.index = index;
        markVisited();
        renderQuestion();
      });

      $("questionPalette").appendChild(button);
    });

    const attempted = state.answers.filter((answer) => answer !== null).length;
    $("sidebarProgress").textContent = attempted + " / " + state.quiz.questions.length;
  }

  function previousQuestion() {
    if (state.index > 0) {
      state.index--;
      markVisited();
      saveCurrentDraft();
      renderQuestion();
    }
  }

  function nextQuestion() {
    if (state.index < state.quiz.questions.length - 1) {
      state.index++;
      markVisited();
      saveCurrentDraft();
      renderQuestion();
    } else {
      confirmSubmit();
    }
  }

  function startTimer() {
    stopTimer();
    updateTimer();

    state.timer = setInterval(() => {
      if (!Number.isFinite(Number(state.seconds))) state.seconds = 0;
      state.seconds = Math.max(0, Math.floor(Number(state.seconds)) - 1);
      updateTimer();
      if (state.seconds % 10 === 0) saveCurrentDraft();

      if (state.seconds <= 0) {
        stopTimer();
        notify("Time is over. Your quiz is being submitted.");
        setTimeout(finishQuiz, 500);
      }
    }, 1000);
  }

  function stopTimer() {
    if (state.timer) clearInterval(state.timer);
    state.timer = null;
  }

  function updateTimer() {
    const safeSeconds = Number.isFinite(Number(state.seconds))
      ? Math.max(0, Math.floor(Number(state.seconds)))
      : 0;
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;

    $("quizTimer").textContent =
      String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");

    $("quizTimer").closest(".quiz-timer-box").classList.toggle(
      "warning",
      safeSeconds <= 60
    );
  }

  function confirmSubmit() {
    if (!state.quiz) return;

    const attempted = state.answers.filter((answer) => answer !== null).length;

    $("submitSummary").textContent =
      "You have attempted " + attempted + " of " + state.quiz.questions.length +
      " questions. Do you want to submit the quiz?";

    $("quizConfirmModal").classList.add("show");
    $("quizConfirmModal").setAttribute("aria-hidden", "false");
  }

  function closeConfirm() {
    $("quizConfirmModal").classList.remove("show");
    $("quizConfirmModal").setAttribute("aria-hidden", "true");
  }

  function finishQuiz() {
    if (!state.quiz || state.finished) return;

    state.finished = true;
    stopTimer();
    closeConfirm();

    const result = calculateResult();
    state.result = result;
    state.attemptRecord = createAttemptRecord(state.quiz, result);
    saveLocalAttempt(state.attemptRecord);
    removeQuizDraft(state.attemptRecord.quizId);
    submitAttemptToBackend(state.attemptRecord);
    renderResult(result);
    renderRecentHistory();

    $("quizRunner").classList.remove("show");
    $("quizRunner").setAttribute("aria-hidden", "true");
    exitQuizMode();
    $("quizResultScreen").classList.add("show");
    $("quizResultScreen").setAttribute("aria-hidden", "false");
    document.body.style.overflow = "auto";
  }

  function calculateResult() {
    let correct = 0;
    let wrong = 0;
    let obtainedMarks = 0;
    let totalMarks = 0;

    state.quiz.questions.forEach((question, index) => {
      const marks = Number(question.marks);
      const negativeMarks = Number(question.negativeMarks);
      const answer = state.answers[index];

      totalMarks += marks;

      if (answer === null) return;

      if (isCorrectAnswer(answer, question.answer)) {
        correct++;
        obtainedMarks += marks;
      } else {
        wrong++;
        obtainedMarks -= negativeMarks;
      }
    });

    return {
      correct,
      wrong,
      attempted: correct + wrong,
      obtainedMarks,
      totalMarks
    };
  }

  function renderResult(result) {
    $("resultQuizTitle").textContent = state.quiz.title;
    $("resultObtainedMarks").textContent = formatMarks(result.obtainedMarks);
    $("resultTotalMarks").textContent = formatMarks(result.totalMarks);
    $("resultCorrect").textContent = result.correct;
    $("resultWrong").textContent = result.wrong;
    $("resultAttempted").textContent = "Attempted: " + result.attempted;
    $("answerReviewList").innerHTML = "";

    state.quiz.questions.forEach((question, index) => {
      const selected = state.answers[index];
      const correct = selected !== null && isCorrectAnswer(selected, question.answer);
      const wrong = selected !== null && !correct;
      const userAnswer = selected === null
        ? "Not attempted"
        : String(question.options[selected]);
      const correctIndex = getAnswerIndex(question.answer, question.options);
      const correctAnswer = correctIndex >= 0 && question.options[correctIndex] !== undefined
        ? String(question.options[correctIndex])
        : "Not available";

      const item = document.createElement("article");
      item.className = "review-item " + (correct ? "correct" : wrong ? "wrong" : "");

      item.innerHTML = `
                <div class="review-question">
                    Q${index + 1}. ${escapeHtml(String(question.question || ""))}
                </div>
                <div class="review-line user-answer">
                    Your answer: <strong>${escapeHtml(userAnswer)}</strong>
                </div>
                <div class="review-line correct-answer">
                    Correct answer: <strong>${escapeHtml(correctAnswer)}</strong>
                </div>
                <div class="review-line">
                    Result: <strong>${correct ? "Correct" : wrong ? "Wrong" : "Not Attempted"}</strong>
                </div>
                ${question.explanation
          ? `<div class="review-line">Explanation: ${escapeHtml(String(question.explanation))}</div>`
          : ""}
            `;

      $("answerReviewList").appendChild(item);
    });
  }

  function closeResult() {
    $("quizResultScreen").classList.remove("show");
    $("quizResultScreen").setAttribute("aria-hidden", "true");
    state.quiz = null;
    state.result = null;
    state.attemptRecord = null;
    renderRecentHistory();
    refreshStatus();
  }

  function showNoQuiz() {
    stopTimer();
    $("noQuizScreen").classList.add("show");
    $("noQuizScreen").setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeNoQuiz() {
    $("noQuizScreen").classList.remove("show");
    $("noQuizScreen").setAttribute("aria-hidden", "true");
    document.body.style.overflow = "auto";
  }


  function getStudentId() {
    return sessionStorage.getItem("bccStudentId") ||
      localStorage.getItem("bccStudentId") ||
      "demo-student";
  }

  function readLocalHistory() {
    try {
      const raw = localStorage.getItem(quizHistoryStorageKey);
      const data = raw ? JSON.parse(raw) : {};
      return data && typeof data === "object" ? data : {};
    } catch (error) {
      console.error("Quiz history read error:", error);
      return {};
    }
  }

  function writeLocalHistory(data) {
    localStorage.setItem(quizHistoryStorageKey, JSON.stringify(data));
  }

  function getStudentHistory() {
    const all = readLocalHistory();
    const history = Array.isArray(all[getStudentId()]) ? all[getStudentId()] : [];
    return history.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  }

  function getAttempt(quizId) {
    if (!quizId) return null;
    return getStudentHistory().find((attempt) => String(attempt.quizId) === String(quizId)) || null;
  }

  function readQuizDrafts() {
    try {
      const raw = localStorage.getItem(quizDraftStorageKey);
      const data = raw ? JSON.parse(raw) : {};
      return data && typeof data === "object" ? data : {};
    } catch (error) {
      console.error("Quiz draft read error:", error);
      return {};
    }
  }

  function writeQuizDrafts(data) {
    localStorage.setItem(quizDraftStorageKey, JSON.stringify(data));
  }

  function getQuizDraft(quizId) {
    if (!quizId) return null;
    const drafts = readQuizDrafts();
    const key = getStudentId() + "::" + String(quizId);
    return drafts[key] || null;
  }

  function saveCurrentDraft() {
    if (!state.quiz || state.finished) return;

    try {
      const quizId = state.quiz.id || (state.quiz.type + "-" + state.quiz.title);
      if (!quizId) return;

      const drafts = readQuizDrafts();
      const key = getStudentId() + "::" + String(quizId);
      drafts[key] = {
        quizId,
        title: state.quiz.title || "Quiz",
        questionCount: state.quiz.questions.length,
        index: state.index,
        answers: state.answers.slice(),
        visited: state.visited.slice(),
        seconds: Math.max(0, Number(state.seconds) || 0),
        medium: state.medium === "hi" ? "hi" : "en",
        savedAt: new Date().toISOString()
      };
      writeQuizDrafts(drafts);
    } catch (error) {
      console.error("Quiz draft save error:", error);
    }
  }

  function removeQuizDraft(quizId) {
    if (!quizId) return;
    try {
      const drafts = readQuizDrafts();
      delete drafts[getStudentId() + "::" + String(quizId)];
      writeQuizDrafts(drafts);
    } catch (error) {
      console.error("Quiz draft removal error:", error);
    }
  }

  function isDraftCompatible(draft, quiz) {
    return Boolean(
      draft &&
      String(draft.quizId) === String(quiz.id || (quiz.type + "-" + quiz.title)) &&
      Number(draft.questionCount) === quiz.questions.length
    );
  }

  function restoreAnswers(answers, length) {
    const restored = new Array(length).fill(null);
    if (!Array.isArray(answers)) return restored;
    for (let i = 0; i < length; i++) {
      restored[i] = Number.isInteger(answers[i]) ? answers[i] : null;
    }
    return restored;
  }

  function restoreVisited(visited, length) {
    const restored = new Array(length).fill(false);
    if (!Array.isArray(visited)) return restored;
    for (let i = 0; i < length; i++) restored[i] = Boolean(visited[i]);
    return restored;
  }

  function createAttemptRecord(quiz, result) {
    return {
      quizId: quiz.id || (quiz.type + "-" + quiz.title),
      type: quiz.type || quiz.quizType || "quiz",
      subject: quiz.subject || "",
      subjectName: quiz.subjectName || "",
      chapter: quiz.chapter || "",
      title: quiz.title || "Quiz",
      obtainedMarks: result.obtainedMarks,
      totalMarks: result.totalMarks,
      correct: result.correct,
      wrong: result.wrong,
      attempted: result.attempted,
      totalQuestions: quiz.questions.length,
      submittedAt: new Date().toISOString(),
      answers: state.answers.slice(),
      questions: JSON.parse(JSON.stringify(quiz.questions))
    };
  }

  function saveLocalAttempt(attempt) {
    const all = readLocalHistory();
    const studentId = getStudentId();
    const current = Array.isArray(all[studentId]) ? all[studentId] : [];
    const existingIndex = current.findIndex((item) => String(item.quizId) === String(attempt.quizId));

    if (existingIndex >= 0) {
      current[existingIndex] = attempt;
    } else {
      current.push(attempt);
    }

    all[studentId] = current;
    writeLocalHistory(all);
  }

  async function submitAttemptToBackend(attempt) {
    if (!quizConfig.submitEndpoint) return;

    try {
      await fetch(quizConfig.submitEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: getStudentId(), attempt })
      });
    } catch (error) {
      console.error("Quiz submission sync error:", error);
    }
  }

  const historyToggleButton = $("quizHistoryToggle");
  if (historyToggleButton) {
    historyToggleButton.addEventListener("click", () => {
      const historyList = $("quizHistoryList");
      if (!historyList) return;
      const expanded = historyToggleButton.getAttribute("aria-expanded") === "true";
      historyToggleButton.setAttribute("aria-expanded", String(!expanded));
      historyList.hidden = expanded;
    });
  }

  function renderRecentHistory() {
    const list = $("quizHistoryList");
    const empty = $("quizHistoryEmpty");
    const toggle = $("quizHistoryToggle");
    const latestPreview = $("quizHistoryLatest");
    if (!list || !empty || !toggle || !latestPreview) return;

    const history = getStudentHistory();
    list.innerHTML = "";
    empty.hidden = history.length > 0;
    toggle.hidden = history.length === 0;

    if (!history.length) {
      toggle.setAttribute("aria-expanded", "false");
      list.hidden = true;
      return;
    }

    const latest = history[0];
    latestPreview.innerHTML = `
            <span class="latest-preview-title">${escapeHtml(latest.title || "Quiz")}</span>
            <span class="latest-preview-score">${formatMarks(latest.obtainedMarks)} / ${formatMarks(latest.totalMarks)}</span>
            <span class="latest-preview-date">${formatHistoryDate(latest.submittedAt)}</span>
        `;

    history.forEach((attempt) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "quiz-history-card";
      card.innerHTML = `
                <div class="history-card-icon"><i class="fa-solid ${attempt.type === "monthly" ? "fa-calendar-days" : attempt.type === "chapter" ? "fa-book-bookmark" : "fa-calendar-week"}"></i></div>
                <div class="history-card-main">
                    <span>${escapeHtml(String(attempt.type || "Quiz").replace(/^./, (m) => m.toUpperCase()))} • ${escapeHtml(attempt.quizId)}</span>
                    <h3>${escapeHtml(attempt.title || "Quiz")}</h3>
                    <p>${formatHistoryDate(attempt.submittedAt)} • <b>SUBMITTED</b></p>
                </div>
                <div class="history-card-score"><strong>${formatMarks(attempt.obtainedMarks)}</strong><span>/ ${formatMarks(attempt.totalMarks)}</span></div>
                <i class="fa-solid fa-chevron-right history-card-arrow"></i>
            `;
      card.addEventListener("click", () => {
        window.location.href = "quiz-history.html?quizId=" + encodeURIComponent(attempt.quizId);
      });
      list.appendChild(card);
    });

    // Keep the full history collapsed by default; the latest attempt is previewed above.
    toggle.setAttribute("aria-expanded", "false");
    list.hidden = true;
  }

  function showSubmittedNotice(quiz) {
    const attempt = getAttempt(quiz && quiz.id);
    if (!attempt) return;
    notify("Quiz already submitted. Marks: " + formatMarks(attempt.obtainedMarks) + " / " + formatMarks(attempt.totalMarks) + ". Reattempt is not allowed.");
    renderRecentHistory();
  }

  function formatHistoryDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value || "");
    return date.toLocaleString([], { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  async function downloadCurrentAnalysis() {
    if (!state.attemptRecord) return;
    downloadAttemptPdf(state.attemptRecord);
  }

  function downloadAttemptPdf(attempt) {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      notify("PDF service is not loaded. Please check your internet connection and try again.");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = 210;
    const margin = 16;
    let y = 18;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("BRILLIANT COACHING CENTRE", margin, y);
    y += 8;
    doc.setFontSize(13);
    doc.text("Quiz Analysis", margin, y);
    y += 9;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Quiz ID: " + attempt.quizId, margin, y); y += 5;
    doc.text("Quiz: " + attempt.title, margin, y); y += 5;
    doc.text("Status: SUBMITTED", margin, y); y += 5;
    doc.text("Submitted: " + formatHistoryDate(attempt.submittedAt), margin, y); y += 9;

    doc.setFont("helvetica", "bold");
    doc.text("Score Summary", margin, y); y += 6;
    doc.setFont("helvetica", "normal");
    doc.text("Obtained: " + formatMarks(attempt.obtainedMarks) + " / " + formatMarks(attempt.totalMarks), margin, y); y += 5;
    doc.text("Correct: " + attempt.correct + "   Wrong: " + attempt.wrong + "   Attempted: " + attempt.attempted + " / " + attempt.totalQuestions, margin, y); y += 9;

    doc.setFont("helvetica", "bold");
    doc.text("Answer Analysis", margin, y); y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);

    attempt.questions.forEach((question, index) => {
      const selected = attempt.answers[index];
      const correctIndex = getAnswerIndex(question.answer, question.options);
      const userAnswer = selected === null || selected === undefined ? "Not attempted" : String(question.options[selected]);
      const correctAnswer = correctIndex >= 0 ? String(question.options[correctIndex]) : "Not available";
      const isCorrect = selected !== null && selected !== undefined && Number(selected) === Number(correctIndex);
      const result = selected === null || selected === undefined ? "Not Attempted" : (isCorrect ? "Correct" : "Wrong");
      const lines = doc.splitTextToSize("Q" + (index + 1) + ". " + String(question.question || ""), pageWidth - margin * 2);

      if (y + lines.length * 4.5 + 20 > 285) {
        doc.addPage();
        y = 18;
      }

      doc.setFont("helvetica", "bold");
      doc.text(lines, margin, y);
      y += lines.length * 4.5 + 2;
      doc.setFont("helvetica", "normal");
      doc.text("Your answer: " + userAnswer, margin + 2, y); y += 4.5;
      doc.text("Correct answer: " + correctAnswer, margin + 2, y); y += 4.5;
      doc.text("Result: " + result, margin + 2, y); y += 7;
    });

    const safeName = String(attempt.title || "quiz-analysis").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
    doc.save(safeName + "-analysis.pdf");
  }

  async function getQuizzes(type, subject, date) {
    if (quizConfig.useBackend) {
      return fetchBackendQuizzes(type, subject, date);
    }

    return demoQuizData
      .filter((item) => {
        const sameType = item.type === type;
        const sameSubject = !subject || String(item.subject || "").toLowerCase() === subject.toLowerCase();
        return sameType && sameSubject && item.active !== false;
      })
      .sort((a, b) => {
        const aStart = a.startAt ? new Date(a.startAt).getTime() : -Infinity;
        const bStart = b.startAt ? new Date(b.startAt).getTime() : -Infinity;
        return aStart - bStart;
      });
  }

  // Backward-compatible helper: when older code asks for one quiz, return
  // the currently active one first. Multiple quizzes are handled by getQuizzes().
  async function getQuiz(type, subject, date) {
    const quizzes = await getQuizzes(type, subject, date);
    return quizzes.find(isQuizActive) || quizzes[0] || null;
  }

  async function fetchBackendQuizzes(type, subject, date) {
    if (!quizConfig.backendEndpoint) return [];

    try {
      const params = new URLSearchParams({ type, date });
      if (subject) params.set("subject", subject);

      const response = await fetch(
        quizConfig.backendEndpoint + "?" + params.toString()
      );

      if (!response.ok) throw new Error("Quiz request failed");

      const data = await response.json();
      return extractQuizzes(data);
    } catch (error) {
      console.error("Quiz backend error:", error);
      notify("Quiz service is currently unavailable.");
      return [];
    }
  }


  async function fetchBackend(type, subject, date) {
    if (!quizConfig.backendEndpoint) return null;

    try {
      const params = new URLSearchParams({ type, date });

      if (subject) params.set("subject", subject);

      const response = await fetch(
        quizConfig.backendEndpoint + "?" + params.toString()
      );

      if (!response.ok) {
        throw new Error("Quiz request failed");
      }

      const data = await response.json();
      return extractQuiz(data);
    } catch (error) {
      console.error("Quiz backend error:", error);
      notify("Quiz service is currently unavailable.");
      return null;
    }
  }

  function extractQuizzes(data) {
    if (!data) return [];

    if (Array.isArray(data)) return data;
    if (Array.isArray(data.quizzes)) return data.quizzes;
    if (data.quiz) return [data.quiz];
    if (data.data && data.data.quiz) return [data.data.quiz];
    if (data.data && Array.isArray(data.data.quizzes)) return data.data.quizzes;

    return data && typeof data === "object" ? [data] : [];
  }

  function extractQuiz(data) {
    return extractQuizzes(data).find(isQuizActive) || null;
  }

  /* =====================================================
     ADMIN SCHEDULE CHECK
     -----------------------------------------------------
     startAt/endAt are the source of truth.
     Example:
     startAt: "2026-09-22T09:00:00+05:30"
     endAt:   "2026-09-22T10:00:00+05:30"

     This works on ANY day of the week and ANY date of the
     month. No Sunday or 1st-day rule exists here.
     ===================================================== */

  function isQuizActive(quiz) {
    if (!quiz) return false;
    if (quiz.active === false) return false;

    const now = Date.now();

    if (quiz.startAt || quiz.endAt) {
      const start = quiz.startAt ? new Date(quiz.startAt).getTime() : -Infinity;
      const end = quiz.endAt ? new Date(quiz.endAt).getTime() : Infinity;

      if (Number.isNaN(start) || Number.isNaN(end)) return false;
      return now >= start && now <= end;
    }

    if (quiz.date) {
      if (quiz.date !== localDate()) return false;
    }

    if (quiz.startTime || quiz.endTime) {
      const currentMinutes = currentTimeMinutes();
      const startMinutes = quiz.startTime ? timeToMinutes(quiz.startTime) : 0;
      const endMinutes = quiz.endTime ? timeToMinutes(quiz.endTime) : 1439;

      if (startMinutes === null || endMinutes === null) return false;
      return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    }

    return quiz.active !== false;
  }

  function getScheduleText(quiz) {
    if (!quiz) return "";

    if (quiz.startAt || quiz.endAt) {
      const start = quiz.startAt ? formatDateTime(quiz.startAt) : "Now";
      const end = quiz.endAt ? formatDateTime(quiz.endAt) : "No end time";
      return "Scheduled: " + start + " – " + end;
    }

    if (quiz.date) {
      if (quiz.startTime || quiz.endTime) {
        return "Scheduled for " + quiz.date + " • " +
          (quiz.startTime || "00:00") + " – " + (quiz.endTime || "23:59");
      }

      return "Scheduled for " + quiz.date;
    }

    return "No quiz has been activated right now.";
  }

  function formatDateTime(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleString([], {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function currentTimeMinutes() {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  }

  function timeToMinutes(value) {
    const parts = String(value).split(":");

    if (parts.length < 2) return null;

    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);

    if (
      !Number.isInteger(hours) ||
      !Number.isInteger(minutes) ||
      hours < 0 || hours > 23 || minutes < 0 || minutes > 59
    ) {
      return null;
    }

    return hours * 60 + minutes;
  }

  function localDate() {
    const now = new Date();

    return now.getFullYear() + "-" +
      String(now.getMonth() + 1).padStart(2, "0") + "-" +
      String(now.getDate()).padStart(2, "0");
  }

  function isCorrectAnswer(selectedIndex, answer) {
    return Number(selectedIndex) === Number(getAnswerIndex(answer));
  }

  function getAnswerIndex(answer, options) {
    if (typeof answer === "number") return answer;

    if (typeof answer === "string") {
      const trimmed = answer.trim();
      const upper = trimmed.toUpperCase();

      if (/^[A-Z]$/.test(upper)) {
        return upper.charCodeAt(0) - 65;
      }

      if (options) {
        const exactIndex = options.findIndex(
          (option) => String(option) === trimmed
        );

        if (exactIndex !== -1) return exactIndex;
      }

      const number = Number(trimmed);
      if (Number.isInteger(number)) return number;
    }

    return -1;
  }

  function formatMarks(value) {
    return Number.isInteger(value) ? String(value) : Number(value).toFixed(2);
  }

  function notify(message) {
    $("quizNotification").textContent = message;
    $("quizNotification").classList.add("show");

    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => {
      $("quizNotification").classList.remove("show");
    }, 3500);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
