
import { routes } from './routes'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
function App() {
  
  return (
    <>
      <Router>
        <Routes>
          {routes.map((route, index) => {
            const Page = route.page
            return (
              <Route key={route.path} path={route.path} element={<Page />} />
            )
          })}
        </Routes>
      </Router>
    </>
  )
}

export default App
