export type QuickCard = { title: string; seed: string }
export type Release = { title: string; artist: string; seed: string }

export const quickCards: QuickCard[] = [
  { title: 'Indie Rock Mix', seed: 'indie-rock' }, { title: 'Sleep Token Mix', seed: 'sleep-mix' },
  { title: 'Dayseeker Mix', seed: 'dayseeker' }, { title: 'Foo Fighters Mix', seed: 'foo-fighters' },
  { title: 'MGK Mix', seed: 'mgk' }, { title: 'Daily Mix 4', seed: 'daily-mix' },
  { title: 'Sleep Token', seed: 'sleep-token' }, { title: 'Staind Mix', seed: 'staind' },
]

export const releases: Release[] = [
  { title: "PARTY'S OVER", artist: 'Sueco', seed: 'party-over' },
  { title: 'Everything Under The Sun', artist: 'Nickelback', seed: 'under-sun' },
  { title: 'After The Storm', artist: 'Skillet', seed: 'after-storm' },
  { title: 'Unshatter Film Soundtrack', artist: 'Linkin Park', seed: 'unshatter' },
]
