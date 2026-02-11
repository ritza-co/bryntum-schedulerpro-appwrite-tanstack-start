import { TanStackDevtools } from '@tanstack/react-devtools';
import {
    createRootRoute,
    HeadContent,
    Outlet,
    Scripts,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { UserProvider, useUser } from '../lib/context/user';

import appCss from '../styles.css?url';

export const Route = createRootRoute({
    head: () => ({
        meta: [
            { charSet: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { title: 'Bryntum Scheduler Pro with Appwrite' },
        ],
        links: [{ rel: 'stylesheet', href: appCss }],
    }),
    shellComponent: RootDocument,
    component: RootLayout,
});

function RootDocument({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <HeadContent />
            </head>
            <body>
                {children}
                <TanStackDevtools
                    config={{ position: 'bottom-right' }}
                    plugins={[
                        {
                            name: 'TanStack Router',
                            render: <TanStackRouterDevtoolsPanel />,
                        },
                    ]}
                />
                <Scripts />
            </body>
        </html>
    );
}

function RootLayout() {
    return (
        <UserProvider>
            <AppShell />
        </UserProvider>
    );
}

function AppShell() {
    const user = useUser();

    return (
        <div id="app">
            <nav>
                <div>
                    {user?.current
                        ? (
                            <div className="logged-in-items">
                                <span><b>Logged in as:</b> {user.current.email}</span>
                                <button
                                    className="button"
                                    type="button"
                                    onClick={() => user.logout()}
                                    disabled={user.isLoading}
                                >
                                Log Out
                                </button>
                            </div>
                        )
                        : (
                            <div className="logged-out-item">
                            Using Bryntum Scheduler Pro with Appwrite
                            </div>
                        )}
                </div>
            </nav>
            <main>
                <Outlet />
            </main>
        </div>
    );
}