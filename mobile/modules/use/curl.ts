// useLibs
// noPage
import { useSafeState } from 'esoftplay';
import { LibCurl } from 'esoftplay/cache/lib/curl/import';
import { LibProgress } from 'esoftplay/cache/lib/progress/import';


export default function m(initialWithLoading?: boolean, withProgressText?: string): [(uri: string, post: any, onDone: (res: any, msg: string) => void, debug?: 0 | 1) => void, boolean, string] {
  const [loading, setLoading] = useSafeState(initialWithLoading)
  const [error, setError] = useSafeState("")
  function curl(uri: string, post: any, onDone: (res: any, msg: string) => void, debug?: 0 | 1) {
    setLoading(true)
    if (withProgressText) LibProgress.show(withProgressText)
    new LibCurl(uri, post, (res, msg) => {
      LibProgress.hide()
      setLoading(false)
      onDone(res, msg)
    }, (msg) => {
      LibProgress.hide()
      setLoading(false)
      setError(msg.message)
    }, debug)
  }
  return [curl, loading, error]
}