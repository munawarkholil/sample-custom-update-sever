// withHooks
// noPage

// nunggu update master, margin sebelah kanan kegeser

import { LibStyle } from 'esoftplay/cache/lib/style/import';
import useGlobalState from 'esoftplay/global';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { interpolate, useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';

export interface LibToastProps {

}

const initState = {
  message: undefined,
  timeout: 3000
}

const state = useGlobalState<any>(initState)

let _timeout: any = undefined

export function hide(): void {
  state.set(initState)
}

export function show(message: string, timeout?: number): void {
  state.set({
    message: message,
    timeout: timeout || initState.timeout
  })
  if (_timeout) {
    clearTimeout(_timeout)
    _timeout = undefined
  }
  _timeout = setTimeout(() => {
    hide()
  }, timeout || initState.timeout);
}

export default function m(props: LibToastProps): any {
  const [data] = state.useState()
  const anim = useSharedValue(0)

  const style = useAnimatedProps(() => ({
    transform: [{
      translateY: interpolate(anim.value, [0, 1], [-(LibStyle.STATUSBAR_HEIGHT + 400), 0])
    }],
    opacity: interpolate(anim.value, [0, 0.8, 1], [0, 0, 1])
  }))

  useEffect(() => {
    anim.value = withTiming(data?.message ? 1 : 0, { duration: 500 })
  }, [data])

  return (
    <Animated.View pointerEvents={'none'} style={[{ flex: 1, position: 'absolute', justifyContent: 'center', alignContent: 'center', alignItems: 'center', top: LibStyle.STATUSBAR_HEIGHT + 20, left: 0, right: 0, }, style, LibStyle.elevation(2)]} >
      <View style={{ maxWidth: Math.min(500, LibStyle.width - 30), minWidth: Math.min(500, LibStyle.width - 30), marginHorizontal: 15, marginVertical: 4, borderRadius: 4, borderWidth: 1, borderColor: '#505050', backgroundColor: '#323232', paddingVertical: 13, paddingHorizontal: 16, }} >
        <Text style={{ fontSize: 14, textAlign: "center", color: 'white' }} >{String(data?.message || '')}</Text>
      </View>
    </Animated.View>
  )
}