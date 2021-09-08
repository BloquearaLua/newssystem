import IndexRouter from "./router"
import './App.css'
import '../node_modules/antd/dist/antd.css'
import { store } from './redux/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from './redux/store'

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <IndexRouter/>
      </PersistGate>
    </Provider>
      
  );
}

export default App;
