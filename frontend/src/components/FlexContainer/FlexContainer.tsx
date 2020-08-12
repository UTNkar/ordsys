import React, { PropsWithChildren } from 'react';
import { Container }  from 'react-bootstrap';
import './FlexContainer.scss';

interface FlexContainerProps {
    fluid?: true | 'sm' | 'md' | 'lg' | 'xl'
}

function FlexContainer({ children, fluid }: PropsWithChildren<FlexContainerProps>) {
    return (
        <Container fluid={fluid} className='flex-container'>
            { children }
        </Container>
    );
}

export default FlexContainer
