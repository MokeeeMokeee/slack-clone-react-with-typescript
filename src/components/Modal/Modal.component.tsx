import * as React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

const Container = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: ${props => `${props.theme.backgroundColorLight}`};
  z-index: 10;
  padding: 2rem;
  color: ${props => `${props.theme.textColorDark}`};
  box-sizing: border-box;
  font-size: 2rem;
`

const ExitButtonContainer = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  h1 {
    width: 100%;
    text-align: center;
  }
`

const ButtonClose = styled.button`
  outline: none;
  border: none;
  border-radius: 50%;
  padding: 1rem;
  cursor: pointer;
  text-align: center;
  background-color: ${props => `${props.theme.backgroundColorLight}`};
  height: 88px;
  width: 88px;
  i {
    font-size: 2rem;
  }
  &:hover {
    background-color: ${props => `${props.theme.backgroundColorGray}`};
    opacity: 0.7;
  }
  span {
    font-size: 1rem;
  }
`

const Title = styled.h1`
  margin: 1.5rem 0;
`

const ModalBody = styled.div`
  max-width: 500px;
  margin: 0 auto;
  max-height: calc(100vh - 110px);
`

interface Props {
  children: React.ReactNode[] | React.ReactNode
  close: () => void
  title: string
}

export class Modal extends React.Component<Props> {
  modalRoot: HTMLDivElement
  constructor(props: Props) {
    super(props)

    this.modalRoot = document.createElement('div')
    document.body.appendChild(this.modalRoot)
  }

  componentWillUnmount() {
    document.body.removeChild(this.modalRoot)
  }

  render() {
    return ReactDOM.createPortal(
      <Container>
        <>
          <ExitButtonContainer>
            <ButtonClose onClick={this.props.close}>
              <i className="far fa-times-circle" />
              <span>esc</span>
            </ButtonClose>
          </ExitButtonContainer>
          <ModalBody>
            <Title>{this.props.title}</Title>
            {this.props.children}
          </ModalBody>
        </>
      </Container>,
      this.modalRoot
    )
  }
}
