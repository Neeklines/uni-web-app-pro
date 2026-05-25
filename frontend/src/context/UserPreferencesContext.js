import {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';

import { useAuth } from './AuthContext';

const UserPreferencesContext = createContext();

export function UserPreferencesProvider({
    children,
}) {

    const { user } = useAuth();

    const [
        theme,
        setTheme,
    ] = useState('dark');

    const [
        currency,
        setCurrency,
    ] = useState('PLN');

    const [
        dateFormat,
        setDateFormat,
    ] = useState('dd.MM.yyyy');

    const [
        inAppNotifications,
        setInAppNotifications,
    ] = useState(true);

    const [
        emailNotifications,
        setEmailNotifications,
    ] = useState(true);

    /*
    |--------------------------------------------------------------------------
    | Sync from backend user
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (!user)
            return;

        if (theme !== user.theme) {
            setTheme(user.theme || 'dark');
        }

        if (currency !== user.currency) {
            setCurrency(user.currency || 'PLN');
        }

        if (dateFormat !== user.date_format) {
            setDateFormat(
                user.date_format || 'dd.MM.yyyy'
            );
        }

        if (
            inAppNotifications
            !== user.in_app_notifications
        ) {
            setInAppNotifications(
                user.in_app_notifications ?? true
            );
        }

        if (
            emailNotifications
            !== user.email_notifications
        ) {
            setEmailNotifications(
                user.email_notifications ?? true
            );
        }

    }, [user]);

    /*
    |--------------------------------------------------------------------------
    | Apply theme
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        document.documentElement.classList.remove(
            'light',
            'dark'
        );

        document.documentElement.classList.add(
            theme
        );

    }, [theme]);

    return (
        <UserPreferencesContext.Provider
            value={{

                theme,
                setTheme,

                currency,
                setCurrency,

                dateFormat,
                setDateFormat,

                inAppNotifications,
                setInAppNotifications,

                emailNotifications,
                setEmailNotifications,
            }}
        >
            {children}
        </UserPreferencesContext.Provider>
    );
}

export const usePreferences = () =>
    useContext(UserPreferencesContext);