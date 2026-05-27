import './App.css';
import { Switch, Route } from 'react-router-dom/cjs/react-router-dom.min';
import HomePage from './components/home';
import Navbar from './components/navbar';
import PoolManager from './components/poolManager';

function App() {
  return (
    <>
      <Navbar/>
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        <Route path="/pool-manager" exact>
          <PoolManager />
        </Route>
        <Route path="/about" exact>
          <h1 className="text-center py-5">About Component</h1>
        </Route>
        <Route path="/users" exact>
          <h1 className="text-center py-5">Users Component</h1>
        </Route>
      </Switch>
    </>
  );
}

export default App;
