// withHooks
// noPage
export interface UseConditionArgs {

}
export interface UseConditionProps {
  if: boolean,
  children: any,
  fallback?: any
}
export default function m(props: UseConditionProps): any {
  return props.if ? props.children : (props.fallback || null)
}