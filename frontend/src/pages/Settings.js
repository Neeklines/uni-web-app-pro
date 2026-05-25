import { useEffect, useState } from 'react';

import {
    Bell,
    Monitor,
    Palette,
    User,
    Wallet,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import {
    usePreferences,
} from '../context/UserPreferencesContext';

import * as authService from '../services/authService';

function Section({
    icon,
    title,
    children,
}) {
    return (
        <div className="
            rounded-[32px]
            border
            border-gray-700
            bg-gray-950/70
            p-6
            sm:p-8
            shadow-xl
            shadow-black/20
        ">
            <div className="
                mb-6
                flex
                items-center
                gap-3
            ">
                <div className="
                    rounded-2xl
                    bg-blue-500/10
                    p-3
                    text-blue-400
                ">
                    {icon}
                </div>

                <h2 className="
                    text-xl
                    font-semibold
                    text-white
                ">
                    {title}
                </h2>
            </div>

            {children}
        </div>
    );
}

function Settings() {

    const navigate = useNavigate();

    const {
        token,
        user,
        refreshUser,
    } = useAuth();

    /*
    |--------------------------------------------------------------------------
    | Backend settings
    |--------------------------------------------------------------------------
    */

    const [
        displayName,
        setDisplayName,
    ] = useState(
        user?.display_name
        || user?.email
        || ''
    );

    const {

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

    } = usePreferences();

    const [
        saving,
        setSaving,
    ] = useState(false);

    useEffect(() => {

        if (!user)
            return;

        setDisplayName((prev) =>
            prev || user.display_name || user.email
        );

    }, [user]);

    const handleSave = async () => {

        setSaving(true);

        try {

            /*
            |--------------------------------------------------------------------------
            | Backend
            |--------------------------------------------------------------------------
            */

            await authService.updateSettings(
                token,
                {
                    display_name: displayName,

                    theme,
                    currency,
                    date_format: dateFormat,

                    in_app_notifications:
                        inAppNotifications,

                    email_notifications:
                        emailNotifications,
                }
            );

            await refreshUser();

        } catch (err) {

            console.error(err);

        } finally {

            setSaving(false);

        }
    };

    return (
        <div className="
            bg-gray-900
            px-4
            py-8

            sm:px-6
            sm:py-12
        ">
            <div className="
                mx-auto
                max-w-5xl
                space-y-6
            ">

                {/* Header */}
                <div className="
                    flex
                    flex-col
                    gap-4

                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                ">
                    <div>
                        <p className="
                            text-sm
                            uppercase
                            tracking-[0.3em]
                            text-blue-400
                        ">
                            Ustawienia
                        </p>

                        <h1 className="
                            mt-3
                            text-3xl
                            font-semibold
                            text-white
                        ">
                            Preferencje aplikacji
                        </h1>

                        <p className="
                            mt-3
                            text-gray-400
                        ">
                            Zarządzaj swoim profilem,
                            wyglądem aplikacji
                            i powiadomieniami.
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            navigate('/dashboard')
                        }
                        className="
                            rounded-full
                            bg-gray-800
                            px-6
                            py-3
                            text-sm
                            font-semibold
                            text-white
                            transition
                            hover:bg-gray-700
                        "
                    >
                        Powrót
                    </button>
                </div>

                {/* Profile */}
                <Section
                    icon={<User size={22} />}
                    title="Profil"
                >
                    <div className="space-y-3">

                        <label className="
                            block
                            text-sm
                            font-medium
                            text-gray-300
                        ">
                            Widoczna nazwa
                        </label>

                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) =>
                                setDisplayName(
                                    e.target.value
                                )
                            }
                            className="
                                w-full
                                rounded-2xl
                                border
                                border-gray-700
                                bg-gray-800
                                px-4
                                py-3
                                text-white
                                placeholder-gray-400
                                focus:border-blue-500
                                focus:outline-none
                            "
                        />
                    </div>
                </Section>

                {/* Regional */}
                <Section
                    icon={<Wallet size={22} />}
                    title="Regionalne"
                >
                    <div className="
                        grid
                        gap-6

                        sm:grid-cols-2
                    ">

                        {/* Currency */}
                        <div className="space-y-3">

                            <label className="
                                block
                                text-sm
                                font-medium
                                text-gray-300
                            ">
                                Waluta
                            </label>

                            <select
                                value={currency}
                                onChange={(e) =>
                                    setCurrency(
                                        e.target.value
                                    )
                                }
                                className="
                                    w-full
                                    rounded-2xl
                                    border
                                    border-gray-700
                                    bg-gray-800
                                    px-4
                                    py-3
                                    text-white
                                    focus:border-blue-500
                                    focus:outline-none
                                "
                            >
                                <option value="PLN">
                                    PLN
                                </option>

                                <option value="USD">
                                    USD
                                </option>

                                <option value="EUR">
                                    EUR
                                </option>
                            </select>
                        </div>

                        {/* Date format */}
                        <div className="space-y-3">

                            <label className="
                                block
                                text-sm
                                font-medium
                                text-gray-300
                            ">
                                Format daty
                            </label>

                            <select
                                value={dateFormat}
                                onChange={(e) =>
                                    setDateFormat(
                                        e.target.value
                                    )
                                }
                                className="
                                    w-full
                                    rounded-2xl
                                    border
                                    border-gray-700
                                    bg-gray-800
                                    px-4
                                    py-3
                                    text-white
                                    focus:border-blue-500
                                    focus:outline-none
                                "
                            >
                                <option value="dd.MM.yyyy">
                                    23.05.2026
                                </option>

                                <option value="MM/dd/yyyy">
                                    05/23/2026
                                </option>

                                <option value="yyyy-MM-dd">
                                    2026-05-23
                                </option>
                            </select>
                        </div>
                    </div>
                </Section>

                {/* Appearance */}
                <Section
                    icon={<Palette size={22} />}
                    title="Wygląd"
                >
                    <div className="
                        flex
                        flex-col
                        gap-4

                        sm:flex-row
                    ">

                        <button
                            onClick={() =>
                                setTheme('dark')
                            }
                            className={`
                                flex-1
                                rounded-2xl
                                border
                                px-5
                                py-4
                                text-left
                                transition

                                ${theme === 'dark'
                                    ? 'border-blue-500 bg-blue-500/10'
                                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                                }
                            `}
                        >
                            <div className="
                                flex
                                items-center
                                gap-3
                            ">
                                <Monitor
                                    size={20}
                                    className="text-white"
                                />

                                <div>
                                    <p className="
                                        font-medium
                                        text-white
                                    ">
                                        Ciemny
                                    </p>

                                    <p className="
                                        text-sm
                                        text-gray-400
                                    ">
                                        Aktualny motyw aplikacji
                                    </p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() =>
                                setTheme('light')
                            }
                            className={`
                                flex-1
                                rounded-2xl
                                border
                                px-5
                                py-4
                                text-left
                                transition

                                ${theme === 'light'
                                    ? 'border-blue-500 bg-blue-500/10'
                                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                                }
                            `}
                        >
                            <div className="
                                flex
                                items-center
                                gap-3
                            ">
                                <Monitor
                                    size={20}
                                    className="text-white"
                                />

                                <div>
                                    <p className="
                                        font-medium
                                        text-white
                                    ">
                                        Jasny
                                    </p>

                                    <p className="
                                        text-sm
                                        text-gray-400
                                    ">
                                        W przygotowaniu
                                    </p>
                                </div>
                            </div>
                        </button>
                    </div>
                </Section>

                {/* Notifications */}
                <Section
                    icon={<Bell size={22} />}
                    title="Powiadomienia"
                >
                    <div className="space-y-6">

                        {/* In-app */}
                        <div className="
                            flex
                            items-center
                            justify-between
                            gap-4
                        ">
                            <div>
                                <p className="
                                    font-medium
                                    text-white
                                ">
                                    Powiadomienia w aplikacji
                                </p>

                                <p className="
                                    mt-1
                                    text-sm
                                    text-gray-400
                                ">
                                    Informacje o nadchodzących płatnościach.
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setInAppNotifications(
                                        !inAppNotifications
                                    )
                                }
                                className={`
                                    relative
                                    h-8
                                    w-14
                                    rounded-full
                                    transition

                                    ${inAppNotifications
                                        ? 'bg-blue-500'
                                        : 'bg-gray-700'
                                    }
                                `}
                            >
                                <div className={`
                                    absolute
                                    top-1
                                    h-6
                                    w-6
                                    rounded-full
                                    bg-white
                                    transition-all

                                    ${inAppNotifications
                                        ? 'left-7'
                                        : 'left-1'
                                    }
                                `} />
                            </button>
                        </div>

                        {/* Email */}
                        <div className="
                            flex
                            items-center
                            justify-between
                            gap-4
                        ">
                            <div>
                                <p className="
                                    font-medium
                                    text-white
                                ">
                                    Powiadomienia e-mail
                                </p>

                                <p className="
                                    mt-1
                                    text-sm
                                    text-gray-400
                                ">
                                    Przypomnienia wysyłane na e-mail.
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setEmailNotifications(
                                        !emailNotifications
                                    )
                                }
                                className={`
                                    relative
                                    h-8
                                    w-14
                                    rounded-full
                                    transition

                                    ${emailNotifications
                                        ? 'bg-blue-500'
                                        : 'bg-gray-700'
                                    }
                                `}
                            >
                                <div className={`
                                    absolute
                                    top-1
                                    h-6
                                    w-6
                                    rounded-full
                                    bg-white
                                    transition-all

                                    ${emailNotifications
                                        ? 'left-7'
                                        : 'left-1'
                                    }
                                `} />
                            </button>
                        </div>
                    </div>
                </Section>

                {/* Save */}
                <div className="
                    sticky
                    bottom-4
                    flex
                    justify-end
                ">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="
                            rounded-full
                            bg-blue-500
                            px-8
                            py-4
                            text-sm
                            font-semibold
                            text-white
                            shadow-lg
                            shadow-blue-500/20
                            transition
                            hover:bg-blue-400
                            disabled:opacity-50
                        "
                    >
                        {saving
                            ? 'Zapisywanie...'
                            : 'Zapisz zmiany'}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Settings;