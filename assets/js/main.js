/*=============== SHOW SCROLL UP ===============*/ 
const scrollUp = () => {
    const scrollUp = document.getElementById('scroll-up')
    // When the scroll is higher than 350 viewport height, add the show-scroll class to the a tag with the scrollup class
    this.scrollY >= 350 ? scrollUp.classList.add('show-scroll')
        : scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () => {
    const scrollDown = window.scrollY

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - 58,
            sectionId = current.getAttribute('id'),
            sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')

        if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
            sectionsClass.classList.add('active-link')
        } else {
            sectionsClass.classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*=============== DARK LIGHT THEME ===============*/ 
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'ri-sun-line'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-moon-line' : 'ri-sun-line'

// We validate if the user previously chose a topic
if (selectedTheme) {
    // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
    document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
    themeButton.classList[selectedIcon === 'ri-moon-line' ? 'add' : 'remove'](iconTheme)
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})

/*=============== GA4: CV DOWNLOAD AND CONTACT EVENTS ===============*/
// Any link to the UAE CV or the AI Engineer resume PDF (local or root copy)
// counts, with cv_version saying which; marksheet PDFs do not.
// Email, phone and WhatsApp links send contact_click with the method, as on
// hamzaaziz.dev (D-026 in that repo); generate_lead stays for sent forms.
// Guarded so the page still works when analytics is blocked.
document.addEventListener('click', e => {
    const a = e.target.closest('a[href]')
    if (!a || typeof gtag !== 'function') return
    let u
    try { u = new URL(a.href, location.href) } catch { return }
    const version = u.pathname.endsWith('/Hamza_Aziz_CV_UAE.pdf') ? 'uae_cv'
        : u.pathname.endsWith('/Hamza_Aziz_AI_Engineer_Resume.pdf') ? 'resume'
        : null
    if (version) gtag('event', 'cv_download', { link_location: 'cv_page', cv_version: version })
    const method = u.protocol === 'mailto:' ? 'email'
        : u.protocol === 'tel:' ? 'phone'
        : u.hostname === 'wa.me' ? 'whatsapp'
        : null
    if (method) gtag('event', 'contact_click', { method, link_location: 'cv_page' })
})

/*=============== CV BY REGION ===============*/
// The page is the UAE version by default (crawlers, no JS, unknown zone).
// Outside Gulf time zones Download CV links the AI Engineer resume, as on
// hamzaaziz.dev (DECISIONS.md D-018 in that repo), and the UAE-only lines
// (visa, relocation, Abu Dhabi or Dubai) give way to the resume's framing.
const gulfZones = ['Asia/Dubai', 'Asia/Muscat', 'Asia/Qatar', 'Asia/Bahrain', 'Asia/Kuwait', 'Asia/Riyadh'],
    cvDownload = document.querySelector('[data-cv-download]')
let visitorZone = ''
try { visitorZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '' } catch { }
if (cvDownload && visitorZone && !gulfZones.includes(visitorZone)) {
    cvDownload.setAttribute('href', 'https://hamzaaziz.dev/assets/pdf/Hamza_Aziz_AI_Engineer_Resume.pdf')
    document.querySelectorAll('[data-gulf-only]').forEach(el => { el.hidden = true })
    document.querySelectorAll('[data-outside-gulf]').forEach(el => { el.hidden = false })
}
