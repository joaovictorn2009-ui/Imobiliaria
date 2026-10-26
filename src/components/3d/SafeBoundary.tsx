'use client'

import { Component, type ReactNode } from 'react'

interface State {
  failed: boolean
}

/** Evita que uma falha no 3D (ex.: sem WebGL) derrube a página inteira. */
export class SafeBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="rounded-2xl bg-gray-900/60 p-8 text-center text-gray-300" role="status">
          A visualização 3D não está disponível neste dispositivo.
        </div>
      )
    }
    return this.props.children
  }
}
