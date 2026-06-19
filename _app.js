import '../styles/globals.css'
import { AuthProvider } from '../utils/AuthContext'
import { LanguageProvider } from '../utils/LanguageContext'
import { ThemeProvider } from '../utils/ThemeContext'

function MyApp({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  )
}

export default MyApp

