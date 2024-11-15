import ThreeAiChat from '@/ai/360-ai-chat';
import type { AiChat } from '@/ai/ai-chat';
import BaiChuanAiChat from '@/ai/baichuan-ai-chat';
import CharacterAiChat from '@/ai/character-ai-chat';
import ChatGLMAiChat from '@/ai/chatglm-ai-chat';
import ChatGPTAiChat from '@/ai/chatgpt-ai-chat';
import ChatsonicAiChat from '@/ai/chatsonic-ai-chat';
import ClaudeAiChat from '@/ai/claude-ai-chat';
import CozeAiChat from '@/ai/coze-ai-chat';
import CustomAiChat from '@/ai/custom-ai-chat';
import DeepseekAiChat from '@/ai/deepseek-ai-chat';
import DoubaoAiChat from '@/ai/doubao-ai-chat';
import GeminiAiChat from '@/ai/gemini-ai-chat';
import HaiLuoAiChat from '@/ai/hailuo-ai-chat';
import HuggingAiChat from '@/ai/hugging-ai-chat';
import KimiAiChat from '@/ai/kimi-ai-chat';
import LeChatAiChat from '@/ai/lechat-ai-chat';
import MetaAiChat from '@/ai/meta-ai-chat';
import MetasoAiChat from '@/ai/metaso-ai-chat';
import MicrosoftCopilotAiChat from '@/ai/microsoft-copilot-ai-chat';
import PerplexityAiChat from '@/ai/perplexity-ai-chat';
import PoeAiChat from '@/ai/poe-ai-chat';
import SenseAiChat from '@/ai/sense-ai-chat';
import TianGongAiChat from '@/ai/tiangong-ai-chat';
import TongYiAiChat from '@/ai/tongyi-ai-chat';
import WanZhiAiChat from '@/ai/wanzhi-ai-chat';
import YiYanAiChat from '@/ai/yiyan-ai-chat';
import YouAiChat from '@/ai/you-ai-chat';
import YuanBaoAiChat from '@/ai/yuanbao-ai-chat';
import { parse } from '@/common/url-match';
import CustomAiChatStorage from '@/storage/custom-ai-chat-storage';

class AiChatFactory {
    static systemAiChats: AiChat[] = [
        new ChatGPTAiChat(),
        new ClaudeAiChat(),
        new MicrosoftCopilotAiChat(),
        new GeminiAiChat(),
        new PoeAiChat(),
        new CozeAiChat(),
        new PerplexityAiChat(),
        new YouAiChat(),
        new HuggingAiChat(),
        new CharacterAiChat(),
        new LeChatAiChat(),
        new MetaAiChat(),
        new ChatsonicAiChat(),
        new YiYanAiChat(),
        new TongYiAiChat(),
        new KimiAiChat(),
        new TianGongAiChat(),
        new DoubaoAiChat(),
        new DeepseekAiChat(),
        new ChatGLMAiChat(),
        //new XfXingHuoAiChat(),
        new YuanBaoAiChat(),
        new BaiChuanAiChat(),
        //new MetasoAiChat(),
        new HaiLuoAiChat(),
        new SenseAiChat(),
        new WanZhiAiChat(),
        new ThreeAiChat(),
    ];

    static async getAllAiChats(): Promise<AiChat[]> {
        const customAiChatSites = await CustomAiChatStorage.getInstance().getCustomAiChats();
        const customAiChats = customAiChatSites.map(site => {
            if (site.chatInputRuleType === 'custom') {
                return new CustomAiChat(site.id, site.name, site.icon, site.url, [site.matches], site.inputSelector, site.sendButtonSelector, site.sendKeys);
            }
            else {
                const find = this.systemAiChats.find(s => s.id === site.chatInputRule);
                const newAiChat = Object.create(Object.getPrototypeOf(find));
                newAiChat.id = site.id;
                newAiChat.name = site.name;
                newAiChat.icon = site.icon;
                newAiChat.url = site.url;
                newAiChat.matches = [site.matches];
                return newAiChat;
            }
        });

        return [...customAiChats, ...this.systemAiChats];
    }

    static async getAiChat(url: string): Promise<AiChat | null> {
        return (await this.getAllAiChats()).find(chat => chat.matches.some(m => {
            const reg = parse(m);
            //console.log('reg', reg, reg.test(url), url)
            return reg ? reg.test(url) : false;
        } ));
    }
}

export default AiChatFactory;
