# Redux Örneği (Sadece Öğrenmek İçin - Şu An Kullanmıyorsun)

## Redux Nedir?
Redux, state yönetimi için güçlü bir kütüphanedir. Büyük projelerde kullanılır.

## Temel Yapı:

### 1. Store (State'in saklandığı yer)
```javascript
// store.js
import { createStore } from 'redux';

const initialState = {
  messages: [],
  sidebarVisible: false,
};

// Reducer (state'i nasıl değiştireceğini söyler)
const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarVisible: !state.sidebarVisible,
      };
    default:
      return state;
  }
};

export const store = createStore(chatReducer);
```

### 2. Action (Ne yapılacağını söyler)
```javascript
// actions.js
export const addMessage = (message) => ({
  type: 'ADD_MESSAGE',
  payload: message,
});

export const toggleSidebar = () => ({
  type: 'TOGGLE_SIDEBAR',
});
```

### 3. Kullanım
```javascript
// app.js
import { Provider } from 'react-redux';
import { store } from './store';

const App = () => {
  return (
    <Provider store={store}>
      <ChatScreen />
    </Provider>
  );
};

// Bileşende
import { useSelector, useDispatch } from 'react-redux';
import { addMessage } from './actions';

const ChatScreen = () => {
  const messages = useSelector((state) => state.messages);
  const dispatch = useDispatch();

  const handleSend = (text) => {
    dispatch(addMessage({ text, isUser: true }));
  };
};
```

## Ne Zaman Kullan?
- ✅ Çok büyük uygulamalar (100+ bileşen)
- ✅ Karmaşık state mantığı
- ✅ Undo/Redo özelliği gerekiyorsa
- ✅ Time-travel debugging istiyorsan

## Ne Zaman Kullanma?
- ❌ Küçük-orta projeler (senin projen gibi)
- ❌ Basit state yönetimi
- ❌ Öğrenme eğrisi yüksek

