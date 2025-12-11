// IMPORTANT: Edit this file to replace the placeholder content with your own application content.

import { Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import { LayoutProvider } from './layout/context/layoutcontext';
import Dashboard from './features/dashboard/dashboard';
import ExampleFeature from './features/example-feature/example-feature';

function App() {
    return (
        <LayoutProvider>
            <Layout>
                <Routes>
                    <Route path="/" element={<Dashboard />} /> {/* Dashboard route. IMPORTANT: Replace with your own dashboard */}
                    <Route path="/example-feature" element={<ExampleFeature />} /> {/* Example feature route. IMPORTANT: Replace with your own feature */}
                </Routes>
            </Layout>
        </LayoutProvider>
    );
}

export default App;
