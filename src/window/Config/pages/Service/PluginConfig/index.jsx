import { Button, Input } from '@nextui-org/react';
import { DropdownTrigger } from '@nextui-org/react';
import { DropdownMenu } from '@nextui-org/react';
import { DropdownItem } from '@nextui-org/react';
import { Dropdown } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { open } from '@tauri-apps/api/shell';
import React from 'react';

import { useConfig } from '../../../../../hooks';

export function PluginConfig(props) {
    const { updateServiceList, onClose, name, pluginList } = props;
    const [pluginConfig, setPluginConfig] = useConfig(name, {}, { sync: false });
    const { t } = useTranslation();

    return (
        <>
            <div className={'config-item'}>
                <h3 className='my-auto select-none cursor-default'>{t('config.service.homepage')}</h3>
                <Button
                    onPress={() => {
                        open(pluginList[name].homepage);
                    }}
                >
                    {t('config.service.homepage')}
                </Button>
            </div>
            {pluginList[name].needs.length === 0 ? (
                <div>{t('services.no_need')}</div>
            ) : (
                pluginList[name].needs.map((x) => {
                    return (
                        pluginConfig &&
                        (x.type ? (
                            <div
                                key={x.key}
                                className={`config-item`}
                            >
                                <h3 className='my-auto select-none cursor-default'>{x.display}</h3>
                                {x.type === 'input' && (
                                    <Input
                                        value={`${pluginConfig.hasOwnProperty(x.key) ? pluginConfig[x.key] : ''}`}
                                        variant='bordered'
                                        className='max-w-[50%]'
                                        onValueChange={(value) => {
                                            setPluginConfig({
                                                ...pluginConfig,
                                                [x.key]: value,
                                            });
                                        }}
                                    />
                                )}
                                {x.type === 'select' && (
                                    <Dropdown>
                                        <DropdownTrigger>
                                            <Button
                                                variant='bordered'
                                                className='max-w-[50%]'
                                            >
                                                {
                                                    x.options[
                                                        pluginConfig.hasOwnProperty(x.key)
                                                            ? pluginConfig[x.key]
                                                            : Object.keys(x.options)[0]
                                                    ]
                                                }
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu
                                            autoFocus='first'
                                            aria-label={x.key}
                                            className='max-h-[40vh] overflow-y-auto'
                                            onAction={(key) => {
                                                setPluginConfig({
                                                    ...pluginConfig,
                                                    [x.key]: key,
                                                });
                                            }}
                                        >
                                            {Object.keys(x.options).map((y) => {
                                                return <DropdownItem key={y}>{x.options[y]}</DropdownItem>;
                                            })}
                                        </DropdownMenu>
                                    </Dropdown>
                                )}
                            </div>
                        ) : (
                            <div
                                key={x.key}
                                className={`config-item`}
                            >
                                <h3 className='my-auto select-none cursor-default'>{x.display}</h3>
                                <Input
                                    value={`${pluginConfig.hasOwnProperty(x.key) ? pluginConfig[x.key] : ''}`}
                                    variant='bordered'
                                    className='max-w-[50%]'
                                    onValueChange={(value) => {
                                        setPluginConfig({
                                            ...pluginConfig,
                                            [x.key]: value,
                                        });
                                    }}
                                />
                            </div>
                        ))
                    );
                })
            )}

            <div>
                <Button
                    fullWidth
                    color='primary'
                    onPress={() => {
                        setPluginConfig(pluginConfig, true);
                        updateServiceList(name);
                        onClose();
                    }}
                >
                    {t('common.save')}
                </Button>
            </div>
        </>
    );
}
