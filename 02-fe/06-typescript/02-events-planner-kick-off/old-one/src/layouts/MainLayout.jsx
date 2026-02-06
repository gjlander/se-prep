import { useState, useEffect } from 'react';
import { Outlet } from 'react-router';
import { me } from '../data/auth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
    // signedIn state is used in the Navbar, and by the MyPond page, so we define it in the layout
    const [signedIn, setSignedIn] = useState(false);
    const [user, setUser] = useState();
    const [checkSession, setCheckSession] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            try {
                const data = await me();

                setUser(data);
                setSignedIn(true);
            } catch (error) {
                console.error(error);
            } finally {
                setCheckSession(false);
            }
        };

        if (checkSession) getUser();
    }, [checkSession]);
    return (
        <div className='bg-slate-600 text-gray-300 flex flex-col min-h-screen'>
            <Navbar
                signedIn={signedIn}
                setSignedIn={setSignedIn}
                user={user}
                setUser={setUser}
            />
            <main className='flex-grow flex flex-col justify-between py-4'>
                <Outlet
                    context={{
                        signedIn,
                        setSignedIn,
                        user,
                        setUser,
                        setCheckSession,
                    }}
                />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
