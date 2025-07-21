import { App, Notice, SuggestModal } from "obsidian";

interface GameRange {
  title :string
  index: number
}


export class GamesRangeSuggester extends SuggestModal<GameRange> {
  rangeOption : Array<GameRange> = []
  onSelected :(option: GameRange)=> void
  constructor(app: App, options:any ,onSelected:(option: GameRange)=> void){
    super(app)
    this.onSelected = onSelected
    const range1 = {
      index : 1,
      title : `1.仅游玩时间超过100小时的游戏 (${options[1].length}个)`
    }
    this.rangeOption.push(range1)
    const range2 = {
      index: 2,
      title: `2.仅最近两个月游玩的游戏 (${options[2].length}个)`
    }
    this.rangeOption.push(range2)
    const range3 = {
      index: 3,
      title: `3.仅游玩过的游戏 (${options[3].length}个)`
    }
    this.rangeOption.push(range3)
    const range4= {
      index: 4,
      title: `4.所有游戏 (${options[4].length}个)`
    }
    this.rangeOption.push(range4)
  }

  // Returns all available suggestions.
  getSuggestions(query: string): GameRange[] {
    return this.rangeOption.filter((range) =>
      range.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Renders each suggestion item.
  renderSuggestion(option: GameRange, el: HTMLElement) {
    el.createEl("div", { text: option.title });
    // el.createEl("small", { text: option.index.toString()});
  }

  // Perform action on the selected suggestion.
  onChooseSuggestion(option: GameRange, evt: MouseEvent | KeyboardEvent) {
    this.onSelected(option)
    // new Notice(`Selected ${option.title}`);
  }
}