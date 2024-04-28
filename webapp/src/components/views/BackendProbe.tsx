// Copyright (c) Microsoft. All rights reserved.

import { useMsal } from '@azure/msal-react';
import { Body1, Spinner, Title3 } from '@fluentui/react-components';
import { FC, useEffect, useMemo, useState } from 'react';
import { renderApp } from '../../index';
import { AuthHelper } from '../../libs/auth/AuthHelper';
import { BackendServiceUrl, NetworkErrorMessage } from '../../libs/services/BaseService';
import { MaintenanceService, MaintenanceStatus } from '../../libs/services/MaintenanceService';
import { useAppDispatch, useAppSelector } from '../../redux/app/hooks';
import { RootState } from '../../redux/app/store';
import { setMaintenance } from '../../redux/features/app/appSlice';
import { useSharedClasses } from '../../styles';

interface IData {
    onBackendFound: () => void;
}

export const BackendProbe: FC<IData> = ({ onBackendFound }) => {
    const classes = useSharedClasses();
    const dispatch = useAppDispatch();
    const { isMaintenance } = useAppSelector((state: RootState) => state.app);
    const maintenanceService = useMemo(() => new MaintenanceService(), []);
    const { instance, inProgress } = useMsal();

    const [model, setModel] = useState<MaintenanceStatus | null>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            const onBackendFoundWithAuthCheck = () => {
                if (!AuthHelper.getAuthConfig()) {
                    // if we don't have the auth config, re-render the app:
                    renderApp();
                } else {
                    // otherwise, we can load as normal
                    onBackendFound();
                }
            };

            AuthHelper.getSKaaSAccessToken(instance, inProgress)
                .then((token) =>
                    maintenanceService
                        .getMaintenanceStatus(token)
                        .then((data) => {
                            // Body has payload. This means the app is in maintenance
                            setModel(data);
                        })
                        .catch((e: any) => {
                            if (e instanceof Error && e.message.includes(NetworkErrorMessage)) {
                                // a network error was encountered, so we should probe until we find the backend:
                                return;
                            }

                            // JSON Exception since response has no body. This means app is not in maintenance.
                            dispatch(setMaintenance(false));
                            onBackendFoundWithAuthCheck();
                        }),
                )
                .catch(() => {
                    // Ignore - we'll retry on the next interval
                });
        }, 3000);

        return () => {
            clearInterval(timer);
        };
    }, [dispatch, maintenanceService, onBackendFound, instance, inProgress]);

    return (
        <>
            {isMaintenance ? (
                <div className={classes.informativeView}>
                    <Title3>{model?.title ?? 'Site em manutenção...'}</Title3>
                    <Spinner />
                    <Body1>
                        {model?.message ?? 'A manutenção planejada do local está em andamento. Pedimos desculpas pelo transtorno.'}
                    </Body1>
                    <Body1>
                        <strong>
                            {model?.note ??
                                "Nota: Se esta mensagem não for resolvida após um período significativo, atualize o navegador."}
                        </strong>
                    </Body1>
                </div>
            ) : (
                <div className={classes.informativeView}>
                    <Title3>Conectando...</Title3>
                    <Spinner />
                    <Body1>
                        Este aplicativo espera encontrar um servidor rodando em <strong>{BackendServiceUrl}</strong>
                    </Body1>
                    <Body1>
                        Para executar o servidor localmente, use Visual Studio, Visual Studio Code ou digite o seguinte comando:{' '}
                        <code>
                            <strong>dotnet run</strong>
                        </code>
                    </Body1>
                    <Body1>
                        Se estiver executando localmente, certifique-se de ter a variável{' '}
                        <code>
                            <b>REACT_APP_BACKEND_URI</b>
                        </code>{' '}
                         definida em seu <b>webapp/.env</b> file
                    </Body1>
                </div>
            )}
        </>
    );
};
