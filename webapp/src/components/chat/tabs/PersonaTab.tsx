/* eslint-disable @typescript-eslint/no-unsafe-argument */
// Copyright (c) Microsoft. All rights reserved.

import { Button, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger } from '@fluentui/react-components';
import * as React from 'react';
import { useChat } from '../../../libs/hooks/useChat';
import personas from '../../../personas.json';
import { useAppDispatch, useAppSelector } from '../../../redux/app/hooks';
import { RootState } from '../../../redux/app/store';
import { editConversationSystemDescription } from '../../../redux/features/conversations/conversationsSlice';
import { MemoryBiasSlider } from '../persona/MemoryBiasSlider';
import { PromptEditor } from '../persona/PromptEditor';
import { TabView } from './TabView';

export const PersonaTab: React.FC = () => {
    const chat = useChat();
    const dispatch = useAppDispatch();

    const { conversations, selectedId } = useAppSelector((state: RootState) => state.conversations);
    const chatState = conversations[selectedId];

    const [shortTermMemory, setShortTermMemory] = React.useState<string>('');
    const [longTermMemory, setLongTermMemory] = React.useState<string>('');
    const [selectedPersona, setSelectedPersona] = React.useState<string>('');

    React.useEffect(() => {
        if (!conversations[selectedId].disabled) {
            void Promise.all([
                chat.getSemanticMemories(selectedId, 'WorkingMemory').then((memories) => {
                    setShortTermMemory(memories.join('\n'));
                }),
                chat.getSemanticMemories(selectedId, 'LongTermMemory').then((memories) => {
                    setLongTermMemory(memories.join('\n'));
                }),
            ]);
        }
        // We don't want to have chat as one of the dependencies as it will cause infinite loop.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedId]);

    return (
        <TabView title="Persona" learnMoreDescription="personas" learnMoreLink=" https://aka.ms/sk-intro-to-personas ">
            <Menu>
                <MenuTrigger>
                    <Button>{selectedPersona || 'Select a persona'}</Button>
                </MenuTrigger>
                <MenuPopover>
                    <MenuList>
                        {Object.entries(personas).map(([key, value]) => (
                            <MenuItem
                                key={key}
                                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                                onClick={async () => {
                                    setSelectedPersona(key);
                                    await chat
                                        .editChat(selectedId, chatState.title, value, chatState.memoryBalance)
                                        .finally(() => {
                                            dispatch(
                                                editConversationSystemDescription({
                                                    id: selectedId,
                                                    newSystemDescription: value,
                                                }),
                                            );
                                        });
                                }}
                            >
                                {key}
                            </MenuItem>
                        ))}
                    </MenuList>
                </MenuPopover>
            </Menu>
            <PromptEditor
                title="Meta Prompt"
                chatId={selectedId}
                prompt={chatState.systemDescription}
                isEditable={true}
                isInvisible={true}
                info="O prompt que define a personalidade do chatbot."
                modificationHandler={async (newSystemDescription: string) => {
                    await chat
                        .editChat(selectedId, chatState.title, newSystemDescription, chatState.memoryBalance)
                        .finally(() => {
                            dispatch(
                                editConversationSystemDescription({
                                    id: selectedId,
                                    newSystemDescription: newSystemDescription,
                                }),
                            );
                        });
                }}
            />
            <PromptEditor
                title="Memória de Curto Prazo (Short Term Memory)"
                chatId={selectedId}
                prompt={`<label>: <details>\n${shortTermMemory}`}
                isEditable={false}
                info="Extraia informações por um curto período de tempo, como alguns segundos ou minutos. Deve ser útil para realizar tarefas cognitivas complexas que requerem atenção, concentração ou cálculo mental."
            />
            <PromptEditor
                title="Memória de Longo Prazo (Long Term Memory)"
                chatId={selectedId}
                prompt={`<label>: <details>\n${longTermMemory}`}
                isEditable={false}
                info="Extraia informações codificadas e consolidadas de outros tipos de memória, como memória de trabalho ou memória sensorial. Deve ser útil para manter e relembrar a identidade pessoal, a história e o conhecimento ao longo do tempo."
            />
            <MemoryBiasSlider />
        </TabView>
    );
};
