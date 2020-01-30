export default interface EventType {
  readonly type: string
  readonly color: string
  readonly subTypeList?: ReadonlyArray<EventType>
}
