// Copyright (c) Microsoft. All rights reserved.

import {
    Button,
    Label,
    Popover,
    PopoverSurface,
    PopoverTrigger,
    Slider,
    makeStyles,
    shorthands,
    tokens,
} from '@fluentui/react-components';
import React from 'react';
import { useChat } from '../../../libs/hooks/useChat';
import { useAppDispatch, useAppSelector } from '../../../redux/app/hooks';
import { RootState } from '../../../redux/app/store';
import { editConversationMemoryBalance } from '../../../redux/features/conversations/conversationsSlice';
import { Info16 } from '../../shared/BundledIcons';

const useClasses = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
    horizontal: {
        display: 'flex',
        ...shorthands.gap(tokens.spacingVerticalSNudge),
        alignItems: 'center',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap(tokens.spacingHorizontalS),
        paddingBottom: tokens.spacingHorizontalM,
    },
    popover: {
        width: '300px',
    },
    header: {
        marginBlockEnd: tokens.spacingHorizontalM,
    },
});

export const MemoryBiasSlider: React.FC = () => {
    const chat = useChat();
    const classes = useClasses();
    const dispatch = useAppDispatch();

    const { conversations, selectedId } = useAppSelector((state: RootState) => state.conversations);
    const chatState = conversations[selectedId];
    const [balance, setBalance] = React.useState<number>(chatState.memoryBalance * 100);

    React.useEffect(() => {
        const balance = chatState.memoryBalance * 100;
        setBalance(balance);
    }, [chatState]);

    const sliderValueChange = (value: number) => {
        void chat.editChat(selectedId, chatState.title, chatState.systemDescription, value / 100).finally(() => {
            setBalance(value);
            dispatch(
                editConversationMemoryBalance({
                    id: selectedId,
                    memoryBalance: value / 100,
                }),
            );
        });
    };

    return (
        <div className={classes.root}>
            <div className={classes.horizontal}>
                <h3>Viés de Memória</h3>
                <Popover withArrow>
                    <PopoverTrigger disableButtonEnhancement>
                        <Button icon={<Info16 />} appearance="transparent" />
                    </PopoverTrigger>
                    <PopoverSurface>
                        Este é um controle deslizante que permite ao usuário direcionar o Bot de chat para a memória de
                        curto ou longo prazo.
                    </PopoverSurface>
                </Popover>
            </div>
            <div>
                <Label>Curto Prazo (Short Term)</Label>
                <Slider
                    min={0}
                    max={100}
                    value={balance}
                    onChange={(_, data) => {
                        sliderValueChange(data.value);
                    }}
                    disabled={conversations[selectedId].disabled}
                />
                <Label>Longo prazo (Long Term)</Label>
            </div>
        </div>
    );
};
