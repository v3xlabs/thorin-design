import { ThorinButton, ThorinAvatar, ThorinLabel, ThorinTag, ThorinModal, ThorinConnectModal } from '@ens-tools/thorin-react'
import '@ens-tools/thorin-core/style.css';
import { useState } from 'react';
import { setupConfig } from '@ens-tools/thorin-core';
import { mainnet } from 'wagmi/chains';
import { Config, WagmiProvider } from 'wagmi';

const config = {
  chains: [mainnet],
} as unknown as Config;

setupConfig(config);

function App() {
  const [testModal, setTestModal] = useState(false)
  const [connectModal, setConnectModal] = useState(false)

  return (
    <WagmiProvider config={config}>
      <h1>I'm a React app using Thorin for Webcomponents</h1>
      <h2>Avatars</h2>
      <ThorinAvatar name="jontes.eth" />
      <h2>Buttons</h2>
      <div style={{
        display: "flex",
        flexDirection: "row",
        gap: "10px"
      }}>
        <ThorinButton variant="primary">Primary</ThorinButton>
        <ThorinButton variant="secondary">Secondary</ThorinButton>
        <ThorinButton variant="disabled">Disabled</ThorinButton>
      </div>
      <h2>Labels</h2>
      <div style={{
        display: "flex",
        flexDirection: "row",
        gap: "10px"
      }}>
        <ThorinLabel variant="default">Default</ThorinLabel>
        <ThorinLabel variant="active">Active</ThorinLabel>
        <ThorinLabel variant="helper">Helper</ThorinLabel>
      </div>
      <h2>Tags</h2>
      <div style={{
        display: "flex",
        flexDirection: "row",
        gap: "10px"
      }}>
        <ThorinTag variant="blue">Blue</ThorinTag>
        <ThorinTag variant="red">Red</ThorinTag>
        <ThorinTag variant="yellow">Yellow</ThorinTag>
        <ThorinTag variant="green">Green</ThorinTag>
        <ThorinTag variant="grey">Grey</ThorinTag>
      </div>
      <h2>Modal</h2>
      <div style={{
        display: "flex",
        flexDirection: "row",
        gap: "10px"
      }}>
        <ThorinButton onClick={() => setTestModal(true)}>Open Modal</ThorinButton>
        <ThorinButton onClick={() => setConnectModal(true)}>Open Connect Modal</ThorinButton>
      </div>
      <ThorinModal open={testModal} modalTitle="Modal Title" onClose={() => setTestModal(false)} closeOnRequest={true}>
        <p>Modal Content</p>
      </ThorinModal>
      <ThorinConnectModal open={connectModal} onClose={() => {
        setConnectModal(false)
      }} />
    </WagmiProvider>
  )
}

export default App
