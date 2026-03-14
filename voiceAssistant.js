// ================= VOICE ASSISTANT =================
document.addEventListener("DOMContentLoaded", () => {

    // ================= ELEMENTS =================
    const getStartedBtn = document.getElementById("getStartedBtn");
    const listeningIndicator = document.getElementById("listeningIndicator");

    // ================= COMMANDS =================
    const commands = {
        en: {
            reminders: ["open reminders","go to reminders","reminders page"],
            medicine: ["open medicine","go to medicine management","medicine page"],
            records: ["open records","go to health records","records page"],
            emergency: ["open emergency","help","emergency"],
            language: ["switch to hindi","switch to tamil","switch to telugu"]
        },
        hi: {
            reminders: ["रिमाइंडर खोलो","रिमाइंडर्स पेज खोलो"],
            medicine: ["दवा पेज खोलो","औषधि खोलो"],
            records: ["स्वास्थ्य रिकॉर्ड खोलो","रिकॉर्ड खोलो"],
            emergency: ["आपातकाल पेज खोलो","सहायता पेज खोलो"],
            language: ["अंग्रेज़ी पर जाओ","तमिल पर जाओ","तेलुगु पर जाओ"]
        },
        ta: {
            reminders: ["நினைவூட்டல்கள் திறக்கவும்"],
            medicine: ["மருந்து திறக்கவும்"],
            records: ["சரித்திரங்கள் திறக்கவும்"],
            emergency: ["அவசர திறக்கவும்"],
            language: ["ஆங்கிலம்","இந்தி","తెలుగు"]
        },
        te: {
            reminders: ["రిమైండర్స్ తెరవండి","రివైండర్ తెరవండి"],
            medicine: ["మందులు తెరవండి","మెడిసిన్ తెరవండి"],
            records: ["రికార్డులు తెరవండి","ఆరోగ్య రికార్డులు తెరవండి"],
            emergency: ["అత్యవసర తెరవండి","సహాయం"],
            language: ["ఇంగ్లీష్ కి మారించు","హింది కి మారించు","తమిళ్ కి మారించు"]
        }
    };

    // ================= RESPONSES =================
    const responses = {
        en: { reminders: "Opening Reminders page", medicine: "Opening Medicine Management page", records: "Opening Health Records page", emergency: "Opening Emergency page", language: "Language command recognized", unknown: "Sorry, I did not understand that command" },
        hi: { reminders: "रिमाइंडर पेज खोल रहा हूँ", medicine: "दवा प्रबंधन पेज खोल रहा हूँ", records: "स्वास्थ्य रिकॉर्ड पेज खोल रहा हूँ", emergency: "आपातकाल पेज खोल रहा हूँ", language: "भाषा बदलने का आदेश समझा गया", unknown: "माफ़ करें, मैं समझ नहीं पाया" },
        ta: { reminders: "நினைவூட்டல்கள் பக்கம் திறக்கப்படுகிறது", medicine: "மருந்து மேலாண்மை பக்கம் திறக்கப்படுகிறது", records: "மருத்துவ பதிவுகள் பக்கம் திறக்கப்படுகிறது", emergency: "அவசர பக்கம் திறக்கப்படுகிறது", language: "மொழி மாற்றம் கமாண்ட் புரிந்தது", unknown: "மன்னிக்கவும், புரியவில்லை" },
        te: { reminders: "రిమైండర్స్ పేజీ తెరవబడుతోంది", medicine: "మందుల నిర్వహణ పేజీ తెరవబడుతోంది", records: "ఆరోగ్య రికార్డులు పేజీ తెరవబడుతున్నాయి", emergency: "అత్యవసర పేజీ తెరవబడుతోంది", language: "భాష మార్చే ఆజ్ఞను గుర్తించింది", unknown: "క్షమించండి, నేను అర్థం చేసుకోలేకపోయాను" }
    };

    // ================= SPEAK FUNCTION =================
    function speak(text) {
        const siteLang = document.getElementById("languageSwitcher")?.value || "en";
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = siteLang === "en" ? "en-US" :
                     siteLang === "hi" ? "hi-IN" :
                     siteLang === "ta" ? "ta-IN" :
                     "te-IN";
        speechSynthesis.speak(utter);
    }

    // ================= BEEP / ALARM =================
    function playBeep(duration = 0.3) {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        oscillator.type = "square";
        oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime);
        oscillator.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration);
    }

    function playAlarm(repeat = 3) {
        let count = 0;
        const interval = setInterval(() => {
            playBeep(0.25);
            count++;
            if(count >= repeat) clearInterval(interval);
        }, 500);
    }

    // ================= VOICE REMINDERS =================
    let notifiedMeds = [];
    let notifiedReminders = [];

    function checkRemindersAndMeds() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMin = now.getMinutes();

        // Medicines
        const meds = JSON.parse(localStorage.getItem("medicines")) || [];
        meds.forEach((med, index) => {
            const [medHour, medMin] = med.time.split(":").map(Number);
            if(medHour === currentHour && medMin === currentMin && !notifiedMeds.includes(index)) {
                notifiedMeds.push(index);
                playAlarm(3);
                speak(`It's time to take your medicine: ${med.name}, ${med.dosage}`);
            }
        });

        // Reminders
        const reminders = JSON.parse(localStorage.getItem("reminders")) || [];
        reminders.forEach((reminder, index) => {
            const [remHour, remMin] = reminder.time.split(":").map(Number);
            if(remHour === currentHour && remMin === currentMin && !notifiedReminders.includes(index)) {
                notifiedReminders.push(index);
                playAlarm(3);
                speak(`Reminder: ${reminder.text}`);
            }
        });
    }

    checkRemindersAndMeds();
    setInterval(checkRemindersAndMeds, 60000);

    // ================= PARSE AND ADD REMINDER =================
function parseAndAddReminder(transcript, lang) {
    // Match "add/set reminder <text> at <hour>:<minute> am/pm" or "1.43 pm"
    const regex = /(?:add reminder|set reminder)\s(.+?)\s(?:at|@)\s(\d{1,2})(?:[:.](\d{1,2}))?\s?(am|pm)?/i;
    const match = transcript.match(regex);

    if (!match) return false; // Not an add reminder command

    let [, text, hour, minute, ampm] = match;
    hour = parseInt(hour);
    minute = minute ? parseInt(minute) : 0;

    // Validate minutes
    if (minute > 59) minute = 0;

    // Handle AM/PM
    if (ampm) {
        ampm = ampm.toLowerCase();
        if (ampm === "pm" && hour < 12) hour += 12;
        if (ampm === "am" && hour === 12) hour = 0;
    }

    // If no AM/PM, assume 24-hour input (like 14:30)
    if (!ampm && hour > 23) hour = 23;

    // Save to localStorage
    const reminders = JSON.parse(localStorage.getItem("reminders")) || [];
    reminders.push({
        text: text.trim(),
        time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    });
    localStorage.setItem("reminders", JSON.stringify(reminders));

    // Reset notifiedReminders so new reminder is notified
    notifiedReminders = [];

    // Speak confirmation
    speak(lang === "hi" ? `रिमाइंडर जोड़ा गया: ${text} at ${hour}:${minute}` :
          lang === "ta" ? `நினைவூட்டல் சேர்க்கப்பட்டது: ${text} at ${hour}:${minute}` :
          lang === "te" ? `రిమైండర్ చేర్చబడింది: ${text} at ${hour}:${minute}` :
          `Reminder added: ${text} at ${hour}:${minute}`);

    return true;
}

// ================= MULTI-LANGUAGE VOICE REMINDER PARSER =================
function parseAndAddReminder(transcript, lang) {
    // Language-specific patterns
    let regex;

    switch(lang) {
        case "hi":
            regex = /(?:रिमाइंडर जोड़ो|सेट करो)\s(.+?)\s(?:at|@|बजे)\s(\d{1,2})(?::(\d{2}))?\s?(am|pm)?/i;
            break;
        case "ta":
            regex = /(?:நினைவூட்டல் சேர்க்கவும்)\s(.+?)\s(?:at|@|மணிக்கு)\s(\d{1,2})(?::(\d{2}))?\s?(am|pm)?/i;
            break;
        case "te":
            regex = /(?:రిమైండర్ చేర్చండి)\s(.+?)\s(?:at|@|గంట)\s(\d{1,2})(?::(\d{2}))?\s?(am|pm)?/i;
            break;
        default: // English
            regex = /(?:add reminder|set reminder)\s(.+?)\s(?:at|@)\s(\d{1,2})(?::(\d{2}))?\s?(am|pm)?/i;
    }

    const match = transcript.match(regex);
    if (!match) return false; // Not an add reminder command

    let [, text, hour, minute, ampm] = match;
    hour = parseInt(hour);
    minute = minute ? parseInt(minute) : 0;

    if (ampm) {
        ampm = ampm.toLowerCase();
        if (ampm === "pm" && hour < 12) hour += 12;
        if (ampm === "am" && hour === 12) hour = 0;
    }

    if (hour > 23) hour = hour % 24; // safety fix
    if (minute > 59) minute = minute % 60;

    // Save to localStorage
    const reminders = JSON.parse(localStorage.getItem("reminders")) || [];
    reminders.push({ text: text.trim(), time: `${hour.toString().padStart(2,'0')}:${minute.toString().padStart(2,'0')}` });
    localStorage.setItem("reminders", JSON.stringify(reminders));

    // Reset notifiedReminders
    notifiedReminders = [];

    // Speak confirmation in user language
    switch(lang) {
        case "hi":
            speak(`रिमाइंडर जोड़ा गया: ${text} at ${hour}:${minute}`);
            break;
        case "ta":
            speak(`நினைவூட்டல் சேர்க்கப்பட்டது: ${text} at ${hour}:${minute}`);
            break;
        case "te":
            speak(`రిమైండర్ చేర్చబడింది: ${text} at ${hour}:${minute}`);
            break;
        default:
            speak(`Reminder added: ${text} at ${hour}:${minute}`);
    }

    return true;
}

    // ================= START LISTENING =================
    if(getStartedBtn){
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        getStartedBtn.addEventListener("click", () => {
            if(!SpeechRecognition){
                alert("Voice recognition not supported in this browser.");
                return;
            }

            const siteLang = document.getElementById("languageSwitcher")?.value || "en";
            const recognition = new SpeechRecognition();
            recognition.lang = siteLang === "en" ? "en-US" :
                               siteLang === "hi" ? "hi-IN" :
                               siteLang === "ta" ? "ta-IN" :
                               "te-IN";
            recognition.interimResults = false;

            if(listeningIndicator) listeningIndicator.style.display = "block";
            recognition.start();

            recognition.onresult = (event) => {
                if(listeningIndicator) listeningIndicator.style.display = "none";
                const transcript = event.results[0][0].transcript.toLowerCase().trim();
                console.log("User said:", transcript);

                // First try add reminder
                if(parseAndAddReminder(transcript, siteLang)) return;

                // Otherwise normal commands
                let handled = false;
                for(let key in commands[siteLang]){
                    if(commands[siteLang][key].some(cmd => transcript.includes(cmd.toLowerCase()))){
                        speak(responses[siteLang][key]);
                        if(["reminders","medicine","records","emergency"].includes(key)){
                            setTimeout(()=>{ window.location.href = key + ".html"; },1200);
                        }
                        handled = true;
                        break;
                    }
                }

                if(!handled) speak(responses[siteLang].unknown);
            };

            recognition.onerror = (e)=>{
                if(listeningIndicator) listeningIndicator.style.display = "none";
                console.log("Voice recognition error:", e);
            };

            recognition.onend = ()=>{
                if(listeningIndicator) listeningIndicator.style.display = "none";
            };
        });
    }

});