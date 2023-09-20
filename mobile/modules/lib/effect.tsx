// noPage
import { LibComponent } from 'esoftplay/cache/lib/component/import';

import isEqual from 'react-fast-compare';

export interface LibEffectProps {
  deps?: any[],
  children: any
}
export interface LibEffectState {

}

export default class m extends LibComponent<LibEffectProps, LibEffectState> {
  deps: any[] = []

  componentDidMount(): void {
    super.componentDidMount();
    this.deps = this.props.deps || []
  }

  shouldComponentUpdate(): boolean {
    let out = true
    const { deps } = this.props
    if (deps) {
      out = false
      if (!isEqual(deps, this.deps)) {
        this.deps = deps
        out = true
      }
    }
    return out
  }

  render(): any {
    return this.props.children || null
  }
}