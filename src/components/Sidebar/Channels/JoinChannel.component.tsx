import * as React from 'react'
import { Modal } from '../../Modal/Modal.component'
import { Form } from '../../../styles/ModalButtons'
import { allChannelsQuery } from '../../../data/queries'
import { Query, QueryResult, Mutation } from 'react-apollo'
import styled from 'styled-components'
import { Input } from '../../../styles/Input.styles'
import { debounce } from 'lodash'
import { StoreContext, Actions } from '../../../store/store'
import { joinChannel } from '../../../data/mutations'

interface Props {
  exitCallback: () => void
}

const ChannelItem = styled.div`
  padding: 1rem 2rem;
  border-top: 1px solid ${props => props.theme.borderColorLight};
  box-sizing: border-box;
  cursor: pointer;
`

const ChannelContainer = styled.div`
  margin-top: 2rem;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  ${ChannelItem}:last-child {
    border-bottom: 1px solid ${props => [props.theme.borderColorLight]};
  }
`

const SearchInput = styled(Input)`
  width: 100%;
  box-sizing: border-box;
`

export function JoinChannel(props: Props) {
  const { user, dispatch } = React.useContext(StoreContext)
  const createMembershipRef = React.useRef<Function>()
  const refetchRef = React.useRef<Function>()
  const fetchData = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    (refetchRef as any).current({ channelName: `%${e.target.value}%` })
  }, 300)
  const filterChannels = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist()
    fetchData(e)
  }

  function selectChannel(
    channel: { id: string; name: string },
    memberships: { userId: String }[]
  ) {
    if (memberships.some(membership => membership.userId === user)) {
      dispatch({ type: Actions.SELECTED_CHANNEL, payload: channel })
    } else {
      (createMembershipRef as any)
        .current({
          variables: { channelId: channel.id, userId: user }
        })
        .then((res: any) => {
          const channelAffilication =
            res.data.insert_Membership.returning[0].Channel
          dispatch({
            type: Actions.SELECTED_CHANNEL,
            payload: channelAffilication
          })
        })
    }
    props.exitCallback()
  }

  return (
    <Modal close={props.exitCallback} title="Browse Channels">
      <>
        <Form>
          <SearchInput
            name="channelName"
            id="channelName"
            placeholder="Seach channels"
            onChange={filterChannels}
          />
        </Form>

        <Mutation mutation={joinChannel}>
          {(createMembershipFn: any) => {
            createMembershipRef.current = createMembershipFn
            return (
              <Query query={allChannelsQuery} variables={{ channelName: '%%' }}>
                {({ loading, error, data, refetch }: QueryResult) => {
                  refetchRef.current = refetch
                  if (loading) {
                    return <p>loading</p>
                  }

                  return (
                    <>
                      <ChannelContainer>
                        {data.Channel.map(
                          (channel: {
                            id: string
                            name: string
                            Memberships: any
                          }) => (
                            <ChannelItem
                              key={channel.id}
                              onClick={() =>
                                selectChannel(
                                  { id: channel.id, name: channel.name },
                                  channel.Memberships
                                )
                              }
                            >
                              # {channel.name}
                            </ChannelItem>
                          )
                        )}
                      </ChannelContainer>
                    </>
                  )
                }}
              </Query>
            )
          }}
        </Mutation>
      </>
    </Modal>
  )
}
