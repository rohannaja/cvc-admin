import "./globals.css";
import Provider from './components/providers';

export const metadata = {
  title: "CVConnect | Admin",
  description: "Integrated solutions for record management.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Provider>
                    {children}
                </Provider>
            </body>
        </html>
    );
}

