import flowerCream from '../assets/subjects/flower-cream.png'
import flowerRose from '../assets/subjects/flower-rose.png'
import butterfly from '../assets/subjects/butterfly.png'
import yarnBall from '../assets/subjects/yarn-ball.png'
import heart from '../assets/subjects/heart.png'
import leaf from '../assets/subjects/leaf.png'
import bowCream from '../assets/subjects/bow-cream.png'
import bowRose from '../assets/subjects/bow-rose.png'
import twineBall from '../assets/subjects/twine-ball.png'

export const decorAssets = {
  flowerCream,
  flowerRose,
  butterfly,
  yarnBall,
  heart,
  leaf,
  bowCream,
  bowRose,
  twineBall,
} as const

export type DecorAssetKey = keyof typeof decorAssets

export interface DecorPlacement {
  asset: DecorAssetKey
  className: string
  alt?: string
}
