import React from 'react';
import {
    ensureNonEmptyString
} from '../../Utility/rules';
import {
    Logger,
    LOG_LEVEL
} from '../Logging/useLogging';
import { ErrorMessage } from './ErrorMessage';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };

        const logLevel = (ensureNonEmptyString(props.level) ? props.level : LOG_LEVEL.WARNING);
        this.logger = new Logger(logLevel);
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.logger.error(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <ErrorMessage message="The component render has caused an error." />;
        }

        return this.props.children;
    }
}