// withHooks

import { LibUpdater } from 'esoftplay/cache/lib/updater/import';
import React from 'react';
import { View } from 'react-native';

export interface MainINdexArgs {

}
export interface MainINdexProps {

}
export default function m(props: MainINdexProps): any {
  return (
    <View style={{ flex: 1, backgroundColor: 'blue' }} >
      <LibUpdater show />
    </View>
  )
}