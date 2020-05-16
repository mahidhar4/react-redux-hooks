import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";

const ModalPopup = (props) => {

    const [showModal, setShowModal] = useState(false);

    const handleToggleModal = () => {
        setShowModal(!showModal);
        props.onClose();
    };

    useEffect(() => {
        setShowModal(props.showModal);
    }, [props.showModal]);

    return (
        <div>
            {showModal && (
                <Modal onCloseRequest={() => handleToggleModal()}>
                    {props.children}
                </Modal>
            )}
        </div>
    );
};

ModalPopup.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    showModal: PropTypes.bool,
    onClose: PropTypes.func
};

export default ModalPopup;
