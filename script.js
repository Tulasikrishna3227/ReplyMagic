// Get elements
const reviewInput = document.getElementById('reviewInput');
const businessType = document.getElementById('businessType');
const tone = document.getElementById('tone');
const language = document.getElementById('language');
const generateBtn = document.getElementById('generateBtn');
const responseOutput = document.getElementById('responseOutput');
const copyBtn = document.getElementById('copyBtn');
const usageCount = document.getElementById('usageCount');

// Usage tracking
let remainingUses = localStorage.getItem('remainingUses');
let lastResetDate = localStorage.getItem('lastResetDate');
const today = new Date().toDateString();

// Reset daily uses
if (lastResetDate !== today) {
    remainingUses = 10;
    localStorage.setItem('remainingUses', 10);
    localStorage.setItem('lastResetDate', today);
}

usageCount.textContent = remainingUses;

// Generate response
generateBtn.addEventListener('click', async () => {
    const review = reviewInput.value.trim();
    
    if (!review) {
        alert('Please paste a review first!');
        return;
    }
    
    if (remainingUses <= 0) {
        alert('No free uses left today! Upgrade to Pro for unlimited.');
        return;
    }
    
    // Show loading
    generateBtn.textContent = '⏳ Generating...';
    generateBtn.disabled = true;
    
    try {
        const response = await generateAIResponse(review);
        responseOutput.value = response;
        
        // Update usage
        remainingUses--;
        localStorage.setItem('remainingUses', remainingUses);
        usageCount.textContent = remainingUses;
        
    } catch (error) {
        alert('Error generating response. Please try again.');
        console.error(error);
    }
    
    generateBtn.textContent = '✨ Generate Response';
    generateBtn.disabled = false;
});

// AI Response Function
async function generateAIResponse(review) {
    const selectedTone = tone.value;
    const selectedBusiness = businessType.value;
    const selectedLanguage = language.value;
    
    const prompt = `You are a ${selectedBusiness} owner. Write a ${selectedTone} response to this customer review. Keep it professional, helpful, and under 100 words. Write in ${selectedLanguage}.

Customer Review: "${review}"

Response:`;

    // Option 1: Use Google Gemini (FREE)
    const API_KEY = 'AIzaSyA82_qQjqufTsw45IhOfEfJITBO_sXX6uM'; // Replace this
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        })
    });
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

// Copy function
copyBtn.addEventListener('click', () => {
    responseOutput.select();
    document.execCommand('copy');
    copyBtn.textContent = '✅ Copied!';
    setTimeout(() => {
        copyBtn.textContent = '📋 Copy Response';
    }, 2000);
});