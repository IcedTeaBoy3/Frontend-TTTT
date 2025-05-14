
import { routes } from './routes'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
function App() {
  
  return (
    <>
      <Router>
        <Routes>
          {routes.map((route, index) => {
            const Page = route.page
             // Nếu route là public, render trực tiếp
            if (route.public) {
              return <Route key={route.path} path={route.path} element={<Page />} />;
            }

            // Nếu route cần bảo vệ, dùng ProtectedRoute
            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <ProtectedRoute roles={route.roles}>
                    <Page />
                  </ProtectedRoute>
                }
              />
            );
            })}
        </Routes>
      </Router>
    </>
  )
}

export default App
