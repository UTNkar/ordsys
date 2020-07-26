import organisationThemes from './themes.json';
import { OrganisationTheme } from '../@types';

const organisationTheme = 'orgTheme'
let appliedTheme: OrganisationTheme | null = null
// Apply theme on launch in case there is a stored theme for this session
// (i.e., someone is logged in but refreshes the web page).
applyTheme(getStoredTheme())

export function applyTheme(theme: OrganisationTheme | null = appliedTheme) {
    if (theme === null && appliedTheme !== null) {
        // Reset colours to the default
        modifyCssVariables(OrganisationTheme.UTN)
    } else if (theme !== null && theme !== appliedTheme) {
        sessionStorage.setItem(organisationTheme, theme)
        modifyCssVariables(theme)
    }
}

export function getAppliedTheme() {
    return appliedTheme
}

function getStoredTheme() {
    return sessionStorage.getItem(organisationTheme) as OrganisationTheme | null
}

function modifyCssVariables(themeName: OrganisationTheme) {
    appliedTheme = themeName
    const siteDocumentStyle = document.documentElement.style
    siteDocumentStyle.setProperty('--button-background-color', organisationThemes[themeName].buttonColor)
    siteDocumentStyle.setProperty('--button-active-color', organisationThemes[themeName].buttonActiveColor)
    siteDocumentStyle.setProperty('--button-hover-color', organisationThemes[themeName].buttonHoverColor)
    siteDocumentStyle.setProperty('--dark-text-color', organisationThemes[themeName].darkTextColor)
    siteDocumentStyle.setProperty('--light-text-color', organisationThemes[themeName].lightTextColor)
}
