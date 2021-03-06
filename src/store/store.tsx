import * as React from 'react'

const initialChannel = localStorage.getItem('selected_channel')
  ? JSON.parse(localStorage.getItem('selected_channel')!)
  : { id: '82c255bb-924d-49de-a9f0-36f852b3e445', name: 'general' }

const initialStoreValue = {
  selectedChannel: initialChannel,
  user: localStorage.getItem('current_user') || '',
  selectedUser: ''
}

export enum Actions {
  'SELECTED_CHANNEL',
  'USER',
  'SELECTED_USER'
}

export const StoreContext = React.createContext<Context>({
  ...initialStoreValue,
  dispatch: () => 'test'
})

type SelectedChannelAction = {
  type: Actions.SELECTED_CHANNEL
  payload: { id: string; name: string }
}
type UserAction = { type: Actions.USER; payload: string }

type SelectedUserAction = { type: Actions.SELECTED_USER; payload: string }

type Action = SelectedChannelAction | UserAction | SelectedUserAction

interface State {
  selectedChannel: { id: string; name: string }
  user: string
  selectedUser: string
}

interface Context extends State {
  dispatch: (action: Action, payload?: any) => void
}

function storeReducer(state: State, action: Action): State {
  switch (action.type) {
    case Actions.SELECTED_CHANNEL:
      return { ...state, selectedChannel: action.payload }
    case Actions.USER:
      return { ...state, user: action.payload }
    case Actions.SELECTED_USER:
      return { ...state, selectedUser: action.payload }
    default:
      throw new Error()
  }
}

interface Props {
  children: React.ReactNode
}

export function StoreContextProvider(props: Props) {
  const [store, dispatch] = React.useReducer(storeReducer, initialStoreValue)
  React.useEffect(() => {
    localStorage.setItem(
      'selecte_channel',
      JSON.stringify(store.selectedChannel)
    )
  }, [store.selectedChannel])

  React.useEffect(() => {
    if (!store.user) {
      const value = prompt('Select a user')
      if (value) {
        localStorage.setItem('current_user', value)
      }
    }
  }, [])

  console.log(store)
  return (
    <StoreContext.Provider value={{ ...store, dispatch }}>
      {props.children}
    </StoreContext.Provider>
  )
}
