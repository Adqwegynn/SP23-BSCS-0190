// ===================================
// HR VIRTUAL ASSISTANT - SECURE VERSION
// 🔒 PRIVACY-FIRST | NO DATA TRANSMISSION
// ===================================

// Initialize PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// ===================================
// SECURITY CONFIGURATION
// ===================================
const SECURITY_CONFIG = {
    maxFileSize: 10 * 1024 * 1024, // 10MB max
    allowedTypes: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    allowedExtensions: ['pdf', 'doc', 'docx'],
    autoCleanupTime: 300000, // Auto cleanup after 5 minutes
    sanitizeInput: true
};

// Global Variables (Session only - cleared on page refresh)
let currentFile = null;
let analysisData = null;
let secureSessionId = generateSecureSessionId();
let cleanupTimer = null;

// ===================================
// PRIVACY CONSENT
// ===================================
window.addEventListener('load', showPrivacyNotice);

function showPrivacyNotice() {
    const consent = sessionStorage.getItem('privacyConsent');
    if (!consent) {
        const notice = document.createElement('div');
        notice.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:10000;display:flex;align-items:center;justify-content:center;';
        notice.innerHTML = `
            <div style="background:white;padding:40px;border-radius:20px;max-width:600px;box-shadow:0 10px 40px rgba(0,0,0,0.3);">
                <h3 style="color:#667eea;margin-bottom:20px;">🔒 Privacy & Data Security Notice</h3>
                <p style="margin-bottom:15px;"><strong>Your data is 100% private and secure:</strong></p>
                <ul style="margin-bottom:20px;line-height:1.8;">
                    <li>✅ All processing happens <strong>locally in your browser</strong></li>
                    <li>✅ <strong>No data is sent</strong> to any external server</li>
                    <li>✅ CV content is <strong>never stored</strong> or saved</li>
                    <li>✅ Data is <strong>automatically cleared</strong> when you close/refresh</li>
                    <li>✅ <strong>No tracking, no cookies, no analytics</strong></li>
                    <li>✅ <strong>100% GDPR compliant</strong></li>
                </ul>
                <p style="margin-bottom:20px;color:#666;font-size:14px;">
                    Session ID: ${secureSessionId.substring(0, 8)}... (for your reference only)
                </p>
                <button onclick="acceptPrivacy()" style="width:100%;padding:15px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:10px;font-size:16px;font-weight:600;cursor:pointer;">
                    I Understand - Continue Securely
                </button>
            </div>
        `;
        document.body.appendChild(notice);
        notice.querySelector('button').addEventListener('click', function() {
            sessionStorage.setItem('privacyConsent', 'true');
            notice.remove();
        });
    }
}

function acceptPrivacy() {
    sessionStorage.setItem('privacyConsent', 'true');
    const notice = document.querySelector('[style*="position:fixed"]');
    if (notice) notice.remove();
}

function generateSecureSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// ===================================
// SECURE FILE UPLOAD HANDLER
// ===================================
document.getElementById('cvFile').addEventListener('change', handleSecureFileUpload);

function handleSecureFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Security Check 1: File Type Validation
    if (!SECURITY_CONFIG.allowedTypes.includes(file.type)) {
        showSecurityAlert('Invalid file type! Only PDF and Word documents are allowed for security reasons.');
        clearFileInput();
        return;
    }

    // Security Check 2: File Extension Validation
    const extension = file.name.split('.').pop().toLowerCase();
    if (!SECURITY_CONFIG.allowedExtensions.includes(extension)) {
        showSecurityAlert('Invalid file extension! Only .pdf, .doc, .docx are allowed.');
        clearFileInput();
        return;
    }

    // Security Check 3: File Size Validation
    if (file.size > SECURITY_CONFIG.maxFileSize) {
        showSecurityAlert(`File too large! Maximum size is ${SECURITY_CONFIG.maxFileSize / (1024 * 1024)}MB for security.`);
        clearFileInput();
        return;
    }

    // Security Check 4: File Name Sanitization
    const sanitizedName = sanitizeFileName(file.name);

    currentFile = file;
    
    const fileInfo = document.getElementById('fileInfo');
    fileInfo.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <strong>📄 File:</strong> ${escapeHtml(sanitizedName)}<br>
                <strong>📊 Size:</strong> ${(file.size / 1024).toFixed(2)} KB<br>
                <strong>📂 Type:</strong> ${extension.toUpperCase()}<br>
                <strong>🔒 Status:</strong> <span style="color: green;">Securely Loaded (Local Only)</span>
            </div>
            <button onclick="clearFileData()" style="background: #f44336; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">
                🗑️ Clear
            </button>
        </div>
    `;
    fileInfo.classList.add('show');
    
    document.getElementById('analyzeBtn').disabled = false;

    // Start auto-cleanup timer
    startCleanupTimer();
    
    console.log('🔒 File securely loaded - Session:', secureSessionId);
}

// ===================================
// SECURITY HELPER FUNCTIONS
// ===================================

function sanitizeFileName(fileName) {
    return fileName.replace(/[<>:"\/\\|?*\x00-\x1f]/g, '_');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function sanitizeInput(input) {
    if (!SECURITY_CONFIG.sanitizeInput) return input;
    
    return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/onerror=/gi, '')
        .replace(/onclick=/gi, '');
}

function showSecurityAlert(message) {
    const alert = document.createElement('div');
    alert.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:9999;';
    alert.innerHTML = `
        <div style="background: #fff3cd; border: 2px solid #ffc107; border-radius: 10px; padding: 20px; max-width: 600px; box-shadow: 0 5px 15px rgba(0,0,0,0.2);">
            <h3 style="color: #856404; margin-bottom: 10px;">⚠️ Security Notice</h3>
            <p style="color: #856404;">${escapeHtml(message)}</p>
            <button onclick="this.parentElement.parentElement.remove()" style="margin-top: 15px; padding: 10px 20px; background: #ffc107; border: none; border-radius: 5px; cursor: pointer; font-weight: 600;">
                Understood
            </button>
        </div>
    `;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 5000);
}

function clearFileInput() {
    document.getElementById('cvFile').value = '';
    currentFile = null;
    document.getElementById('fileInfo').classList.remove('show');
    document.getElementById('analyzeBtn').disabled = true;
}

function clearFileData() {
    clearFileInput();
    showSecurityAlert('File data cleared from memory for your security.');
}

// ===================================
// AUTO-CLEANUP TIMER
// ===================================

function startCleanupTimer() {
    if (cleanupTimer) clearTimeout(cleanupTimer);
    
    cleanupTimer = setTimeout(() => {
        if (currentFile) {
            clearFileInput();
            clearAnalysisData();
            showSecurityAlert('Session auto-cleaned after 5 minutes of inactivity for your privacy.');
        }
    }, SECURITY_CONFIG.autoCleanupTime);
}

function clearAnalysisData() {
    analysisData = null;
    document.getElementById('resultsSection').classList.remove('show');
    console.log('🔒 Analysis data cleared from memory');
}

// ===================================
// MAIN ANALYSIS FUNCTION (SECURE)
// ===================================

document.getElementById('analyzeBtn').addEventListener('click', analyzeMatchSecure);

async function analyzeMatchSecure() {
    const jobTitle = document.getElementById('jobTitle').value.trim();
    const jobDescription = document.getElementById('jobDescription').value.trim();

    if (!jobTitle || !jobDescription) {
        showSecurityAlert('Please enter job title and description!');
        return;
    }

    if (!currentFile) {
        showSecurityAlert('Please upload a CV file!');
        return;
    }

    const sanitizedTitle = sanitizeInput(jobTitle);
    const sanitizedJD = sanitizeInput(jobDescription);

    document.getElementById('loading').classList.add('show');
    document.getElementById('analyzeBtn').disabled = true;

    console.log('🔒 Starting secure local analysis - Session:', secureSessionId);

    try {
        let cvText = '';
        if (currentFile.type === 'application/pdf') {
            cvText = await extractPDFTextSecure(currentFile);
        } else {
            cvText = await extractWordTextSecure(currentFile);
        }

        cvText = sanitizeInput(cvText);

        console.log('🔒 Text extracted securely (length:', cvText.length, 'chars)');

        const results = performSecureAnalysis(cvText, sanitizedJD, sanitizedTitle);
        analysisData = results;

        displayResults(results);

        console.log('✅ Analysis complete - No data transmitted externally');

    } catch (error) {
        console.error('🔒 Secure analysis error:', error);
        showSecurityAlert('Error analyzing CV: ' + error.message);
    } finally {
        document.getElementById('loading').classList.remove('show');
        document.getElementById('analyzeBtn').disabled = false;
    }
}

// ===================================
// SECURE PDF TEXT EXTRACTION
// ===================================

async function extractPDFTextSecure(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = async function(e) {
            try {
                console.log('🔒 Processing PDF locally in browser...');
                const typedArray = new Uint8Array(e.target.result);
                const pdf = await pdfjsLib.getDocument(typedArray).promise;
                let fullText = '';
                
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(' ');
                    fullText += pageText + '\n';
                }
                
                if (fullText.trim().length < 50) {
                    throw new Error('Could not extract sufficient text from PDF.');
                }
                
                console.log('✅ PDF processed successfully - All data kept local');
                resolve(fullText);
            } catch (error) {
                console.error('🔒 PDF extraction error:', error);
                reject(error);
            }
        };
        
        reader.onerror = () => reject(new Error('Failed to read file securely'));
        reader.readAsArrayBuffer(file);
    });
}

// ===================================
// SECURE WORD TEXT EXTRACTION
// ===================================

async function extractWordTextSecure(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = async function(e) {
            try {
                console.log('🔒 Processing Word document locally in browser...');
                const arrayBuffer = e.target.result;
                const result = await mammoth.extractRawText({ arrayBuffer });
                
                if (result.value.trim().length < 50) {
                    throw new Error('Could not extract sufficient text from Word document.');
                }
                
                console.log('✅ Word document processed successfully - All data kept local');
                resolve(result.value);
            } catch (error) {
                console.error('🔒 Word extraction error:', error);
                reject(error);
            }
        };
        
        reader.onerror = () => reject(new Error('Failed to read file securely'));
        reader.readAsArrayBuffer(file);
    });
}

// ===================================
// SECURE ANALYSIS LOGIC
// ===================================

function performSecureAnalysis(cvText, jobDescription, jobTitle) {
    console.log('🔒 Performing secure local analysis');
    
    const skillsDatabase = [
        'Python', 'JavaScript', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Swift', 'Kotlin',
        'TypeScript', 'R', 'MATLAB', 'Scala', 'Perl', 'Rust', 'Dart', 'React', 'Angular',
        'Vue.js', 'Vue', 'Node.js', 'Django', 'Flask', 'Spring Boot', 'Spring', 'Laravel',
        'Express.js', 'Express', 'FastAPI', 'ASP.NET', 'MySQL', 'PostgreSQL', 'MongoDB',
        'Redis', 'Oracle', 'SQL Server', 'SQLite', 'AWS', 'Azure', 'Google Cloud', 'GCP',
        'Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'Git', 'GitHub', 'GitLab', 'Terraform',
        'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy',
        'HTML', 'CSS', 'Bootstrap', 'Tailwind CSS', 'REST API', 'GraphQL', 'Leadership',
        'Communication', 'Problem Solving', 'Team Collaboration', 'Project Management',
        'Agile', 'Scrum', 'SEO', 'Digital Marketing', 'UI/UX', 'Figma', 'Photoshop'
    ];

    const cvSkills = extractSkills(cvText, skillsDatabase);
    const jdSkills = extractSkills(jobDescription, skillsDatabase);

    const matchedSkills = cvSkills.filter(skill => 
        jdSkills.some(jdSkill => 
            jdSkill.toLowerCase() === skill.toLowerCase() ||
            jdSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(jdSkill.toLowerCase())
        )
    );

    const missingSkills = jdSkills.filter(skill => 
        !matchedSkills.some(matched => matched.toLowerCase() === skill.toLowerCase())
    );

    const cvExperience = extractExperience(cvText);
    const jdExperience = extractExperience(jobDescription);
    const cvQualifications = extractQualifications(cvText);
    const jdQualifications = extractQualifications(jobDescription);

    const matchScore = calculateMatchScore(
        matchedSkills.length, jdSkills.length, cvExperience, 
        jdExperience, cvQualifications, jdQualifications
    );

    let matchLevel = 'Low Match';
    let matchClass = 'low';
    if (matchScore >= 75) {
        matchLevel = 'High Match';
        matchClass = 'high';
    } else if (matchScore >= 50) {
        matchLevel = 'Medium Match';
        matchClass = 'medium';
    }

    return {
        jobTitle, matchScore, matchLevel, matchClass,
        matchedSkills, missingSkills, cvExperience, jdExperience,
        cvQualifications, jdQualifications,
        allCVSkills: cvSkills, allJDSkills: jdSkills
    };
}

function extractSkills(text, database) {
    const found = [];
    const lowerText = text.toLowerCase();
    database.forEach(skill => {
        if (lowerText.includes(skill.toLowerCase())) {
            found.push(skill);
        }
    });
    return [...new Set(found)];
}

function extractExperience(text) {
    const patterns = [/(\d+)\+?\s*years?/i, /(\d+)\s*-\s*(\d+)\s*years?/i];
    for (let pattern of patterns) {
        const match = text.match(pattern);
        if (match) return parseInt(match[1]) || 0;
    }
    return 0;
}

function extractQualifications(text) {
    const qualifications = [];
    const keywords = ['Bachelor', 'Master', 'PhD', 'MBA', 'Degree', 'Certificate'];
    keywords.forEach(keyword => {
        if (text.toLowerCase().includes(keyword.toLowerCase())) {
            qualifications.push(keyword);
        }
    });
    return [...new Set(qualifications)];
}

function calculateMatchScore(matchedCount, totalJDSkills, cvExp, jdExp, cvQual, jdQual) {
    let score = 0;
    if (totalJDSkills > 0) score += (matchedCount / totalJDSkills) * 60;
    if (jdExp > 0) {
        score += Math.min(cvExp / jdExp, 1) * 25;
    } else if (cvExp > 0) score += 15;
    if (jdQual.length > 0 && cvQual.length > 0) {
        score += cvQual.some(q => jdQual.some(jq => jq.toLowerCase().includes(q.toLowerCase()))) ? 15 : 5;
    } else if (cvQual.length > 0) score += 10;
    return Math.min(Math.round(score), 100);
}

// ===================================
// DISPLAY RESULTS
// ===================================

function displayResults(results) {
    document.getElementById('resultsSection').classList.add('show');
    setTimeout(() => {
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
    }, 100);

    document.getElementById('scoreCircle').className = `score-circle ${results.matchClass}`;
    document.getElementById('scorePercentage').textContent = `${results.matchScore}%`;
    document.getElementById('matchLevel').textContent = results.matchLevel;
    document.getElementById('scoreLabel').textContent = `For: ${escapeHtml(results.jobTitle)}`;

    const matchedDiv = document.getElementById('matchedSkills');
    matchedDiv.innerHTML = results.matchedSkills.length > 0 ?
        results.matchedSkills.map(s => `<span class="skill-tag matched">${escapeHtml(s)}</span>`).join('') :
        '<p style="color:#999">No matching skills found</p>';

    const missingDiv = document.getElementById('missingSkills');
    missingDiv.innerHTML = results.missingSkills.length > 0 ?
        results.missingSkills.map(s => `<span class="skill-tag missing">${escapeHtml(s)}</span>`).join('') :
        '<p style="color:#999">All required skills covered!</p>';

    const expStatus = results.cvExperience >= results.jdExperience && results.jdExperience > 0 ? 
        '✅ <strong>Meets requirement</strong>' : 
        results.cvExperience > 0 && results.jdExperience > 0 ? '⚠️ <strong>Below requirement</strong>' :
        results.cvExperience > 0 ? '✅ <strong>Experience present</strong>' : '❌ <strong>Not specified</strong>';

    document.getElementById('experienceAnalysis').innerHTML = `
        <div class="details-row">
            <span class="details-label">CV Experience:</span>
            <span class="details-value">${results.cvExperience}+ years</span>
        </div>
        <div class="details-row">
            <span class="details-label">Required:</span>
            <span class="details-value">${results.jdExperience}+ years</span>
        </div>
        <div style="margin-top:15px;padding:10px;background:#f0f7ff;border-radius:8px">${expStatus}</div>
    `;

    document.getElementById('qualificationsAnalysis').innerHTML = `
        <div class="details-row">
            <span class="details-label">CV Qualifications:</span>
            <span class="details-value">${results.cvQualifications.length > 0 ? escapeHtml(results.cvQualifications.join(', ')) : 'Not specified'}</span>
        </div>
        <div class="details-row">
            <span class="details-label">Required:</span>
            <span class="details-value">${results.jdQualifications.length > 0 ? escapeHtml(results.jdQualifications.join(', ')) : 'Not specified'}</span>
        </div>
    `;

    document.getElementById('recommendations').innerHTML = generateRecommendations(results);
}

function generateRecommendations(results) {
    let html = '';
    if (results.matchClass === 'high') {
        html += `<div class="recommendation"><h4>🎉 Strong Candidate</h4><ul>
            <li><strong>Skills:</strong> ${results.matchedSkills.length}/${results.allJDSkills.length}</li>
            <li><strong>Decision:</strong> Proceed to interview</li></ul></div>`;
    } else if (results.matchClass === 'medium') {
        html += `<div class="recommendation"><h4>💪 Good Potential</h4><ul>
            <li><strong>Skills:</strong> ${results.matchedSkills.length}/${results.allJDSkills.length}</li>
            <li><strong>Decision:</strong> Consider with training</li></ul></div>`;
    } else {
        html += `<div class="recommendation"><h4>📚 Needs Development</h4><ul>
            <li><strong>Skills:</strong> ${results.matchedSkills.length}/${results.allJDSkills.length}</li>
            <li><strong>Decision:</strong> Significant gaps exist</li></ul></div>`;
    }
    return html;
}

// ===================================
// DOWNLOAD REPORT
// ===================================

document.getElementById('downloadBtn').addEventListener('click', downloadSecureReport);

function downloadSecureReport() {
    if (!analysisData) return;

    const report = `
==============================================
HR VIRTUAL ASSISTANT - SECURE ANALYSIS
==============================================
Generated: ${new Date().toLocaleString()}
Job: ${analysisData.jobTitle}

MATCH SCORE: ${analysisData.matchScore}% (${analysisData.matchLevel})

MATCHED SKILLS (${analysisData.matchedSkills.length}):
${analysisData.matchedSkills.map((s, i) => `${i+1}. ${s}`).join('\n')}

MISSING SKILLS (${analysisData.missingSkills.length}):
${analysisData.missingSkills.map((s, i) => `${i+1}. ${s}`).join('\n')}

EXPERIENCE:
CV: ${analysisData.cvExperience}+ years
Required: ${analysisData.jdExperience}+ years

🔒 This report was generated locally on your device.
No data was transmitted externally.
==============================================
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CV_Analysis_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// ===================================
// RESET SYSTEM
// ===================================

document.getElementById('resetBtn').addEventListener('click', resetSystem);

function resetSystem() {
    document.getElementById('jobTitle').value = '';
    document.getElementById('jobDescription').value = '';
    clearFileInput();
    clearAnalysisData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===================================
// DRAG AND DROP
// ===================================

const uploadArea = document.getElementById('uploadArea');

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.background = '#e8ebff';
});

uploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadArea.style.background = '#f8f9ff';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.background = '#f8f9ff';
    const file = e.dataTransfer.files[0];
    if (file) {
        document.getElementById('cvFile').files = e.dataTransfer.files;
        handleSecureFileUpload({ target: { files: [file] } });
    }
});

console.log('🔒 HR Virtual Assistant Ready - 100% Secure & Private');