function swap (arr, i, j) {
  const tmp = arr[i]
  arr[i] = arr[j]
  arr[j] = tmp
}

function* moveToPosition (nums, i) {
  let j = i
  while (j > 0 && nums[j - 1] > nums[j]) {
    swap(nums, j, j-1)
    yield [nums, j-1]
    j--
  }
}

function* insertionSortGenerator (nums) {
  for (let i = 0; i < nums.length; i++) {
    yield* moveToPosition(nums, i)
  }
}


const CANVAS_HEIGHT = 300
const CANVAS_WIDTH = 300
const canvas = document.getElementById('canvas')
canvas.setAttribute('height', CANVAS_HEIGHT)
canvas.setAttribute('width', CANVAS_WIDTH)

const ctx = canvas.getContext('2d')

function normalize (nums) {
  const max = Math.max(...nums)
  const min = Math.min(...nums)
  return nums.map(num => (num - min) / (max - min))
}

function mapDataToBarHeight (normalizedData) {
  return normalizedData.map(datum => datum * CANVAS_HEIGHT)
}

const compose = (f, g) => x => f(g(x))

const normalizeAndGetHeight = compose(mapDataToBarHeight, normalize)

function render (nums, movingIndex) {
  ctx.fillStyle = 'white'
  ctx.fillRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT)
  const numBars = nums.length
  const barWidth = CANVAS_WIDTH / numBars
  const bars = normalizeAndGetHeight(nums)
  bars.forEach((barHeight, i) => {
    const offsetX = i * barWidth
    const offsetY = CANVAS_HEIGHT - barHeight

    ctx.fillStyle = i === movingIndex ? 'yellow' : 'green'

    ctx.fillRect(offsetX, offsetY, barWidth, barHeight)
    ctx.strokeRect(offsetX, offsetY, barWidth, barHeight)
  })
}

function go (nums, speed) {
  const gen = insertionSortGenerator(nums)
  let gameInterval = setInterval(() => {
    const data = gen.next()
    if (!data.done) {
      const [arr, index] = data.value
      render(arr, index)
    } else {
      clearInterval(gameInterval)
    }
  }, speed)
}

const button = document.getElementById('go')
const input = document.getElementById('array')
const slider = document.getElementById('speed')
const sliderValue = document.getElementById('speed-value')
sliderValue.innerHTML = slider.value

button.addEventListener('click', (e) => {
  const data = JSON.parse(input.value)
  go(data, slider.value)
})

slider.addEventListener('change', (e) => {
  sliderValue.innerHTML = slider.value
})
