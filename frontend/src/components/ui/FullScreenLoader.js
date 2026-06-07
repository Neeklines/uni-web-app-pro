import { usePreferences } from "../../context/UserPreferencesContext";

function FullScreenLoader({ show }) {
    const { theme } = usePreferences();
    console.log('Loader theme:', theme);
    return (
        <div
            className={`
        fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300
        ${theme === 'light' ? 'bg-[rgb(248,244,238)]' : 'bg-gray-900'} 
        ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
        >
            <div className={`w-10 h-10 border-4 ${theme === 'light' ? 'border-[rgb(90,65,40)]' : 'border-gray-600'} border-t-transparent rounded-full animate-spin`} />
        </div>
    );
}

export default FullScreenLoader;