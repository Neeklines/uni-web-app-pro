import {
    useEffect,
    useState
} from 'react';

import {
    useNavigate
} from 'react-router-dom';

import {
    useAuth
} from '../context/AuthContext';

import * as authService
    from '../services/authService';

function Settings() {

    const navigate =
        useNavigate();

    const {
        token,
        user,
        refreshUser
    } = useAuth();

    const [
        displayName,
        setDisplayName
    ] = useState('');

    const [
        notifications,
        setNotifications
    ] = useState(true);

    const [
        showConfirm,
        setShowConfirm
    ] = useState(false);

    useEffect(() => {

        if (!user)
            return;

        setDisplayName(
            user.display_name
            ||
            user.email
        );

        setNotifications(
            user.show_notifications
            ??
            true
        );

    }, [user]);

    const handleSave =
        async () => {

            setShowConfirm(
                false
            );

            try {

                await authService.updateSettings(
                    token,
                    displayName,
                    notifications
                );

                await refreshUser();

                navigate(
                    '/dashboard'
                );

            } catch (err) {

                console.error(
                    err
                );

            }

        };

    return (

        <div className="
            max-w-3xl
            mx-auto
            mt-10
            p-8
            bg-gray-800
            rounded-2xl
        ">

            <h1 className="
                text-3xl
                text-white
                font-bold
                mb-8
            ">

                Ustawienia

            </h1>

            <div className="
                space-y-8
            ">

                <div>

                    <label className="
                        block
                        text-gray-300
                        text-lg
                        mb-3
                    ">

                        Nazwa wyświetlana

                    </label>

                    <input

                        type="text"

                        value={
                            displayName
                        }

                        onChange={(e) =>
                            setDisplayName(
                                e.target.value
                            )
                        }

                        className="
                            w-full
                            px-4
                            py-3
                            rounded-xl
                            bg-gray-700
                            text-white
                            border
                            border-gray-600
                            focus:outline-none
                            focus:border-blue-500
                        "

                    />

                </div>

                <div className="
                    flex
                    justify-between
                    items-center
                ">

                    <span className="
                        text-gray-300
                        text-lg
                        max-w-md
                    ">

                        Pokaż powiadomienia
                        o nadchodzących
                        płatnościach

                    </span>

                    <label className="
                        relative
                        inline-flex
                        items-center
                        cursor-pointer
                    ">

                        <input

                            type="checkbox"

                            checked={
                                notifications
                            }

                            onChange={() =>
                                setNotifications(
                                    !notifications
                                )
                            }

                            className="
                                sr-only
                                peer
                            "

                        />

                        <div className="
                            relative
                            w-14
                            h-8
                            bg-gray-600
                            rounded-full
                            transition
                            peer-checked:bg-blue-500

                            after:content-['']
                            after:absolute
                            after:top-1
                            after:left-1
                            after:w-6
                            after:h-6
                            after:bg-white
                            after:rounded-full
                            after:transition-all

                            peer-checked:after:translate-x-6
                        ">
                        </div>

                    </label>

                </div>

                <div className="
                    flex
                    gap-4
                    pt-4
                ">

                    <button

                        onClick={() =>
                            setShowConfirm(
                                true
                            )
                        }

                        className="
                            bg-blue-500
                            hover:bg-blue-600
                            text-white
                            px-6
                            py-3
                            rounded-lg
                        "

                    >

                        Zapisz zmiany

                    </button>

                    <button

                        onClick={() =>
                            navigate(
                                '/dashboard'
                            )
                        }

                        className="
                            bg-gray-600
                            hover:bg-gray-700
                            text-white
                            px-6
                            py-3
                            rounded-lg
                        "

                    >

                        Wróć

                    </button>

                </div>

            </div>

            {showConfirm && (

                <div className="
                    mt-8
                    p-6
                    bg-gray-700
                    rounded-xl
                ">

                    <p className="
                        text-white
                        mb-4
                    ">

                        Czy na pewno
                        chcesz zapisać
                        zmiany?

                    </p>

                    <div className="
                        flex
                        gap-3
                    ">

                        <button

                            onClick={
                                handleSave
                            }

                            className="
                                bg-green-500
                                hover:bg-green-600
                                text-white
                                px-4
                                py-2
                                rounded-lg
                            "

                        >

                            Tak

                        </button>

                        <button

                            onClick={() =>
                                setShowConfirm(
                                    false
                                )
                            }

                            className="
                                bg-red-500
                                hover:bg-red-600
                                text-white
                                px-4
                                py-2
                                rounded-lg
                            "

                        >

                            Anuluj

                        </button>

                    </div>

                </div>

            )}

        </div>

    );

}

export default Settings;