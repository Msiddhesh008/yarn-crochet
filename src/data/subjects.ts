import flowerCream from '../assets/subjects/flower-cream.png'
import flowerRose from '../assets/subjects/flower-rose.png'
import heart from '../assets/subjects/heart.png'
import butterfly from '../assets/subjects/butterfly.png'
import bowCream from '../assets/subjects/bow-cream.png'
import bowRose from '../assets/subjects/bow-rose.png'
import twineBall from '../assets/subjects/twine-ball.png'
import leaf from '../assets/subjects/leaf.png'
import yarnBall from '../assets/subjects/yarn-ball.png'

export const subjects = {
  flowerCream,
  flowerRose,
  heart,
  butterfly,
  bowCream,
  bowRose,
  twineBall,
  leaf,
  yarnBall,
} as const

export type SubjectKey = keyof typeof subjects
